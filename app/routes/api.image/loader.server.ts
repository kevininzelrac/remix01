import type { LoaderFunctionArgs } from "@remix-run/node";
import { remixHandler } from "server-image-remix";
import { fetchResolver } from "server-image-resolver-fetch";
import { sharpTransformer } from "server-image-transformer-sharp";
import { BASE_URL } from "~/server/constants.server";
import { withMiddleware } from "~/server/middleware/utils";

const config = {
  selfUrl: BASE_URL,
  resolver: fetchResolver,
  transformer: sharpTransformer,
};

export const loader = withMiddleware(
  [],
  ({ context, request }: LoaderFunctionArgs) => {
    return remixHandler(config, request);
  },
);
