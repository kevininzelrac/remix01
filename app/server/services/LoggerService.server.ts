import type { Dependency } from "~/server/injection";
import type { ILoggerService, ServerContext } from "~/server/interfaces";

export class LoggerService
  implements ILoggerService, Dependency<ServerContext>
{
  init(context: ServerContext): void {}

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
