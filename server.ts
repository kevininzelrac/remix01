import {
  createRemixRequest,
  sendRemixResponse,
} from "@remix-run/express/dist/server";
import { createRequestHandler, installGlobals } from "@remix-run/node";
import express from "express";

import { createServerContext } from "~/server";
import { prisma } from "~/server/services/dependencies.server";

async function main() {
  installGlobals();

  const app = express();

  // handle asset requests
  app.use(express.static("public", { maxAge: "1h" }));

  const handler = getRemixHandler();
  // handle SSR requests
  app.all("*", handler);

  const port = 3000;
  app.listen(port, () => console.log("http://localhost:" + port));
}

type RequestHandler = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void>;

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
function getRemixHandler(): RequestHandler {
  const build = require("./build");
  const handleRequest = createRequestHandler(build);

  const handler = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      await prisma.$transaction(async (tx) => {
        let request = createRemixRequest(req, res);
        let loadContext = await createServerContext(tx);
        let response = await handleRequest(request, loadContext);
        if (response.status >= 400) {
          throw response;
        }
        await sendRemixResponse(res, response);
      });
    } catch (error: unknown) {
      if (error instanceof Response) {
        // If a response is thrown, then it is intentional and the FE should handle it.
        error.headers.set("X-Remix-Response", "yes");
        error.headers.delete("X-Remix-Catch");
        await sendRemixResponse(res, error);
        return;
      }
      // Express doesn't support async functions, so we have to pass along the
      // error manually using next().
      next(error);
    }
  };

  return handler;
}

main();
