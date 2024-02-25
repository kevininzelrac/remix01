import type { DataFunctionArgs } from "@remix-run/node";
import type { ServerContext } from "~/server/interfaces";
import type {
  Awaitable,
  DataFunctionValue,
  RouteFunctionGeneric,
} from "~/server/types";

export type ProvideServerContextNext = <T>(
  args: Omit<DataFunctionArgs, "context"> & { context: ServerContext },
) => Awaitable<DataFunctionValue<T>>;

const READONLY_METHODS = ["GET", "OPTIONS"];

export const provideServerContext =
  (next: ProvideServerContextNext): RouteFunctionGeneric =>
  async <T>(args: DataFunctionArgs) => {
    const {
      request,
      context: { container },
    } = args;

    const requestContainer = container.createScope();
    let result: DataFunctionValue<T> | undefined = undefined;

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
      return result;
    } catch (error: unknown) {
      await requestContainer.finalizeError();

      if (result instanceof Response) {
        return result;
      }

      throw error;
    }
  };
