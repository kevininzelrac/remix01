import { json, type DataFunctionArgs } from "@remix-run/node";
import { ClientError } from "~/server/errors/ClientError.server";
import type { ServerContext } from "~/server/interfaces";
import type { DataFunctionValue, RouteFunctionGeneric } from "../types";
import type { Awaitable } from "~/server/types";
import { serverContainer } from "~/server/services";

export type ProvideServerContextNext = (
  args: Omit<DataFunctionArgs, "context"> & { context: ServerContext },
) => Awaitable<DataFunctionValue<unknown>>;

const READONLY_METHODS = ["GET", "OPTIONS"];

export const provideServerContext =
  (next: ProvideServerContextNext): RouteFunctionGeneric =>
  async (args: DataFunctionArgs) => {
    const { request } = args;

    const requestContainer = serverContainer.createScope();
    let result: DataFunctionValue<unknown> | undefined = undefined;

    try {
      await requestContainer.initialize();
      result = await next({
        ...args,
        context: requestContainer.getContext(),
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
