import { BaseError } from "../errors";
import type { Middleware } from "./utils";

export const errorBoundary: Middleware = (f) => async (args) => {
  try {
    return f(args);
  } catch (error) {
    if (error instanceof BaseError) {
      return error.getResponse();
    } else {
      const { context } = args;
      context.loggerService.error("Unhandled error", {
        error:
          error instanceof Error
            ? {
                name: error.name,
                message: error.message,
                stack: error.stack,
              }
            : String(error),
      });
      return new Response("", {
        status: 500,
        statusText: "Unhandled error",
      });
    }
  }
};
