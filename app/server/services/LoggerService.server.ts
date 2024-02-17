import type { ILoggerService } from "~/server/interfaces";

export class LoggerService implements ILoggerService {
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
