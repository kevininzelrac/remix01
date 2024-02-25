import type { DataFunctionArgs } from "@remix-run/node";
import type { ServerContext } from "~/server/interfaces";
import type { DataFunctionValue } from "~/server/types";

export type ProvideServerContextNext = (
  args: Omit<DataFunctionArgs, "context"> & { context: ServerContext },
) => DataFunctionValue;

export const provideServerContext =
  (next: ProvideServerContextNext) =>
  async (args: DataFunctionArgs): Promise<DataFunctionValue> => {
    const {
      context: { container },
    } = args;

    const requestContainer = container.createScope();

    try {
      await requestContainer.initialize();
      return await next({ ...args, context: requestContainer.getContext() });
      // FIXME: finalize container
    } catch (error: unknown) {
      // FIXME: Do something here
      throw new Error("");
    }
  };
