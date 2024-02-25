import { json, type DataFunctionArgs } from "@remix-run/node";
import { ClientError } from "~/server/errors/ClientError.server";
import type { ServerContext } from "~/server/interfaces";
import type { DataFunctionValue, RouteFunctionGeneric } from "../types";
import type { Awaitable } from "~/server/types";

export type ProvideServerContextNext = (
  args: Omit<DataFunctionArgs, "context"> & { context: ServerContext },
) => Awaitable<DataFunctionValue<unknown>>;

const READONLY_METHODS = ["GET", "OPTIONS"];

export const provideServerContext =
  (next: ProvideServerContextNext): RouteFunctionGeneric =>
  async (args: DataFunctionArgs) => {
    const {
      request,
      context: { container },
    } = args;

    const requestContainer = container.createScope();
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
        return json({ data: result, error: null });
      }
    } catch (error: unknown) {
      await requestContainer.finalizeError();

      if (result instanceof Response) {
        return result;
      }

      if (error instanceof Response) {
        return error;
      }

      // FIXME: This check is likely not working because actions are compiled by
      // remix but the load context is compiled by ts-node, so we might have
      // different references for these checks.
      if (error instanceof ClientError) {
        return json({
          data: null,
          error: error.getData(),
        });
      }

      throw error;
    }
  };
