import { createRequestHandler } from "@remix-run/express";
import { installGlobals } from "@remix-run/node";
import express from "express";

import { serverContext } from "~/server";

async function main() {
  installGlobals();

  const app = express();

  // handle asset requests
  app.use(express.static("public", { maxAge: "1h" }));

  // handle SSR requests
  app.all(
    "*",
    createRequestHandler({
      build: require("./build"),

      getLoadContext(req, res) {
        // this becomes the loader context
        return serverContext;
      },
    }),
  );

  const port = 3000;
  app.listen(port, () => console.log("http://localhost:" + port));
}

main();
