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
