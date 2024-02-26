import type { ILoggerService } from "~/server/interfaces/ILoggerService.server";
import type { ServerContext } from "~/server/interfaces/ServerContext.server";

export class ConsoleLoggerService implements ILoggerService {
  debug(message: string, params?: object | undefined): void {
    console.debug({ message, params });
  }

  info(message: string, params?: object | undefined): void {
    console.info({ message, params });
  }

  warning(message: string, params?: object | undefined): void {
    console.warn({ message, params });
  }

  error(message: string, params?: object | undefined): void {
    console.error({ message, params });
  }
}

export const getConsoleLoggerService = (context: ServerContext) => {
  return new ConsoleLoggerService();
};
