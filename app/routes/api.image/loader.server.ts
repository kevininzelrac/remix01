import type { LoaderFunctionArgs } from "@remix-run/node";
import { remixHandler } from "server-image-remix";
import { sharpTransformer } from "server-image-transformer-sharp";
import { BASE_URL } from "~/server/constants.server";

const config = {
  selfUrl: BASE_URL,
  transformer: sharpTransformer,
};

export const loader = ({ context, request }: LoaderFunctionArgs) => {
  return remixHandler(config, request);
};
