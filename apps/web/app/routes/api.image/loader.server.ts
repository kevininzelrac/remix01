import { remixHandler } from "server-image-remix";
import { sharpTransformer } from "server-image-transformer-sharp";
import { BASE_URL } from "~/server/constants.server";
import { middleware } from "~/server/middleware";

const config = {
  selfUrl: BASE_URL,
  transformer: sharpTransformer,
};

export const loader = middleware.build(({ request }) => {
  return remixHandler(config, request);
});
