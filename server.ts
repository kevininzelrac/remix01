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

import { createServerContext } from "~/server";
import { prisma } from "~/server/services/dependencies.server";
import { NODE_ENV, PORT } from "~/server/constants.server";

type RouteHandler = (
  request: FastifyRequest,
  reply: FastifyReply,
) => Promise<void>;

const BUILD_PATH = "./build/index.js";
const VERSION_PATH = "./build/version.txt";

main();

async function main() {
  const initialBuild: ServerBuild = await import(BUILD_PATH);

  let handler: RouteHandler;
  if (NODE_ENV === "production") {
    handler = getRequestHandler(initialBuild);
  } else {
    handler = await getDevRequestHandler(initialBuild);
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
        console.error(error);
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
function getRequestHandler(initialBuild: ServerBuild): RouteHandler {
  const handleRequest = createRequestHandler(initialBuild);

  return async (req, reply) => {
    try {
      let response: Response;
      await prisma.$transaction(async (tx) => {
        const request = createStandardRequest(req, reply);
        let loadContext = await createServerContext(tx);
        response = await handleRequest(request, loadContext);
        if (response.status >= 400) {
          throw response;
        }
      });
      await sendStandardResponse(reply, response!);
    } catch (error: unknown) {
      if (error instanceof Response) {
        // If a response is thrown, then it is intentional and the FE should handle it.
        error.headers.set("X-Remix-Response", "yes");
        error.headers.delete("X-Remix-Catch");
        await sendStandardResponse(reply, error);
        return;
      }

      console.log(error);

      throw error;
    }
  };
}

async function getDevRequestHandler(
  initialBuild: ServerBuild,
): Promise<RouteHandler> {
  const handler = getRequestHandler(initialBuild);
  let build = initialBuild;

  async function handleServerUpdate() {
    // 1. re-import the server build
    build = await reimportServer();
    // 2. tell Remix that this app server is now up-to-date and ready
    await broadcastDevReady(build);
  }

  let chokidar = await import("chokidar");
  chokidar
    .watch(VERSION_PATH, { ignoreInitial: true })
    .on("add", handleServerUpdate)
    .on("change", handleServerUpdate);

  return async (request, reply) => {
    let links = getEarlyHintLinks(request, build);
    await reply.writeEarlyHintsLinks(links);
    return handler(request, reply);
  };
}

/** @returns {Promise<ServerBuild>} */
async function reimportServer() {
  const stat = fs.statSync(BUILD_PATH);

  // convert build path to URL for Windows compatibility with dynamic `import`
  const BUILD_URL = url.pathToFileURL(BUILD_PATH).href;

  // use a timestamp query parameter to bust the import cache
  return import(BUILD_URL + "?t=" + stat.mtimeMs);
}
