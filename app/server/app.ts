import type * as http from "node:http";
import type * as http2 from "node:http2";
import type * as https from "node:https";

import type { ServerBuild } from "@remix-run/node";
import { fastifyEarlyHints } from "@fastify/early-hints";
import { fastifyStatic } from "@fastify/static";
import type { GetLoadContextFunction } from "@mcansh/remix-fastify";
import { createRequestHandler, getEarlyHintLinks } from "@mcansh/remix-fastify";
import { broadcastDevReady, installGlobals } from "@remix-run/node";
import path from "path";
import type { FastifyRequest, FastifyReply } from "fastify";
import fastify from "fastify";

import fs from "node:fs";
import url from "node:url";

import { NODE_ENV, PORT } from "~/server/constants.server";

type HttpServer =
  | http.Server
  | https.Server
  | http2.Http2Server
  | http2.Http2SecureServer;

type IRouteHandler = (
  request: FastifyRequest,
  reply: FastifyReply,
) => Promise<void>;

export async function main(
  root: string,
  getLoadContext: GetLoadContextFunction<HttpServer>,
) {
  const buildPath = path.join(root, "./build/index.js");
  const versionPath = path.join(root, "./build/version.txt");

  const initialBuild: ServerBuild = await import(buildPath);

  let handler: IRouteHandler;
  if (NODE_ENV === "production") {
    handler = getRequestHandler(initialBuild, getLoadContext);
  } else {
    handler = await getDevRequestHandler(
      buildPath,
      versionPath,
      initialBuild,
      getLoadContext,
    );
  }

  installGlobals();

  const app = fastify();
  await app.register(fastifyEarlyHints, { warn: true });
  await app.register(fastifyStatic, {
    root: path.join(root, "public"),
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
    root: path.join(root, "public", "build"),
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

export function getRequestHandler(
  initialBuild: ServerBuild,
  getLoadContext: GetLoadContextFunction<HttpServer>,
): IRouteHandler {
  return createRequestHandler({
    build: initialBuild,
    getLoadContext,
    mode: NODE_ENV,
  });
}

async function getDevRequestHandler(
  buildPath: string,
  versionPath: string,
  initialBuild: ServerBuild,
  getLoadContext: GetLoadContextFunction<HttpServer>,
): Promise<IRouteHandler> {
  const handler = getRequestHandler(initialBuild, getLoadContext);
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
