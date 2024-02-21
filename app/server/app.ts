import type { ServerBuild } from "@remix-run/node";
import { fastifyEarlyHints } from "@fastify/early-hints";
import { fastifyStatic } from "@fastify/static";
import { getEarlyHintLinks } from "@mcansh/remix-fastify";
import {
  broadcastDevReady,
  createRequestHandler,
  installGlobals,
} from "@remix-run/node";
import path from "path";
import type { FastifyRequest, FastifyReply } from "fastify";
import fastify from "fastify";
import {
  createStandardRequest,
  sendStandardResponse,
} from "fastify-standard-request-reply";
import fs from "node:fs";
import url from "node:url";

import { NODE_ENV, PORT } from "~/server/constants.server";
import { StandardError } from "~/server/errors/StandardError.server";
import type { Container } from "~/server/services/container.server";

type RouteHandler = (
  request: FastifyRequest,
  reply: FastifyReply,
) => Promise<void>;

export async function main(
  buildPath: string,
  versionPath: string,
  serverContainer: Container,
) {
  const initialBuild: ServerBuild = await import(buildPath);

  let handler: RouteHandler;
  if (NODE_ENV === "production") {
    handler = getRequestHandler(initialBuild, serverContainer);
  } else {
    handler = await getDevRequestHandler(
      buildPath,
      versionPath,
      initialBuild,
      serverContainer,
    );
  }

  installGlobals();

  const app = fastify();
  await app.register(fastifyEarlyHints, { warn: true });
  await app.register(fastifyStatic, {
    root: path.join(__dirname, "public"),
    prefix: "/",
    wildcard: false,
    cacheControl: true,
    dotfiles: "allow",
    etag: true,
    maxAge: "1h",
    serveDotFiles: true,
    lastModified: true,
  });

  await app.register(fastifyStatic, {
    root: path.join(__dirname, "public", "build"),
    prefix: "/build",
    wildcard: true,
    decorateReply: false,
    cacheControl: true,
    dotfiles: "allow",
    etag: true,
    maxAge: "1y",
    immutable: true,
    serveDotFiles: true,
    lastModified: true,
  });

  app.register(async function (childServer) {
    childServer.removeAllContentTypeParsers();

    // allow all content types
    childServer.addContentTypeParser("*", (_request, payload, done) => {
      done(null, payload);
    });

    // handle SSR requests
    childServer.all("*", async (request, reply) => {
      if (NODE_ENV === "production") {
        let links = getEarlyHintLinks(request, initialBuild);
        await reply.writeEarlyHintsLinks(links);
      }

      try {
        return handler(request, reply);
      } catch (error) {
        return reply.status(500).send(error);
      }
    });
  });

  const port = PORT ?? 3000;
  const address = await app.listen({ port, host: "0.0.0.0" });
  console.log(`✅ app ready: ${address}`);

  if (NODE_ENV === "development") {
    await broadcastDevReady(initialBuild);
  }
}

/**
 * Wanted to ensure that a single request/response cycle was atomic. But Prisma
 * doesn't have an imperative API for transactions, so we need to wrap all of our
 * logic in a callback and give that to prisma. This API can be deceived into an
 * imperative one with some effort though, but we would still need to insert commit
 * and rollback statements after the request is done, and the default express adapter
 * for Remix doesn't give us this option.
 *
 * The solution was to rewrite the express adapter logic (reusing as much as we
 * could, including some "private" functions), and to wrap everything within a
 * Prisma transaction.
 *
 * We also wanted thrown error responses (4xx errors) from actions and loaders
 * to not be sent to a remix errorboundary.
 */
function getRequestHandler(
  initialBuild: ServerBuild,
  serverContainer: Container,
): RouteHandler {
  const handleRequest = createRequestHandler(initialBuild, NODE_ENV);

  return async (req, reply) => {
    const request = createStandardRequest(req, reply);
    const requestContainer = serverContainer.createScope();
    try {
      await requestContainer.initialize();
      const response = await handleRequest(
        request,
        requestContainer.getContext(),
      );
      if (response.status >= 400) {
        throw response;
      }
      await requestContainer.finalizeSuccess();
      await sendStandardResponse(reply, response);
    } catch (error: unknown) {
      await requestContainer.finalizeError();

      if (error instanceof StandardError) {
        // If a standard error is thrown, then it is intentional and the FE should handle it.
        error.headers.set("X-Remix-Response", "yes");
        error.headers.delete("X-Remix-Catch");
      }

      if (error instanceof Response) {
        await sendStandardResponse(reply, error);
        return;
      }

      throw error;
    }
  };
}

async function getDevRequestHandler(
  buildPath: string,
  versionPath: string,
  initialBuild: ServerBuild,
  serverContainer: Container,
): Promise<RouteHandler> {
  const handler = getRequestHandler(initialBuild, serverContainer);
  let build = initialBuild;

  async function handleServerUpdate() {
    // 1. re-import the server build
    build = await reimportServer(buildPath);
    // 2. tell Remix that this app server is now up-to-date and ready
    await broadcastDevReady(build);
  }

  let chokidar = await import("chokidar");
  chokidar
    .watch(versionPath, { ignoreInitial: true })
    .on("add", handleServerUpdate)
    .on("change", handleServerUpdate);

  return async (request, reply) => {
    let links = getEarlyHintLinks(request, build);
    await reply.writeEarlyHintsLinks(links);
    return handler(request, reply);
  };
}

async function reimportServer(buildPath: string): Promise<ServerBuild> {
  const stat = fs.statSync(buildPath);

  // convert build path to URL for Windows compatibility with dynamic `import`
  const BUILD_URL = url.pathToFileURL(buildPath).href;

  // use a timestamp query parameter to bust the import cache
  return import(BUILD_URL + "?t=" + stat.mtimeMs);
}
