import { json } from "@remix-run/node";

import { ClientError } from "~/server/errors/ClientError.server";
import type { ServerContext } from "~/server/interfaces/ServerContext.server";
import type { Awaitable } from "~/server/types";
import { serverContainer } from "~/server/services";

import type {
  DataFunctionArgs,
  DataFunctionValue,
  RouteFunctionGeneric,
} from "../types";

export type DataFunctionArgsWithContainer = DataFunctionArgs & {
  container: ServerContext;
};

export type ProvideServerContextNext = (
  args: DataFunctionArgsWithContainer,
) => Awaitable<DataFunctionValue<unknown>>;

const READONLY_METHODS = ["GET", "OPTIONS"];

export const provideServerContext =
  (next: ProvideServerContextNext): RouteFunctionGeneric =>
  async (args: DataFunctionArgs) => {
    const { request } = args;

    const requestContainer = serverContainer.createScope(request);
    let result: DataFunctionValue<unknown> | undefined = undefined;

    try {
      await requestContainer.initialize();
      result = await next({
        ...args,
        container: requestContainer.getContext(),
      });
      if (
        !READONLY_METHODS.includes(request.method.toUpperCase()) &&
        result instanceof Response &&
        result.status >= 400
      ) {
        throw result;
      }
      await requestContainer.finalizeSuccess();

      if (result instanceof Response) {
        return result;
      } else {
        return json({
          success: true,
          data: result,
          error: null,
        });
      }
    } catch (error: unknown) {
      await requestContainer.finalizeError();

      if (result instanceof Response) {
        return result;
      }

      if (error instanceof Response) {
        return error;
      }

      if (error instanceof ClientError) {
        return json({
          success: false,
          data: null,
          error: error.getData(),
        });
      }

      throw error;
    }
  };
