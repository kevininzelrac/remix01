import { ILoggerService, LogLevel } from "~/types/ILoggerService";

export class ConsoleLoggerService implements ILoggerService {
  constructor(private _logLevel: LogLevel) {}

  debug(message: string, params?: object | undefined): void {
    if (this._logLevel > LogLevel.DEBUG) {
      return;
    }
    console.debug({ message, params });
  }

  info(message: string, params?: object | undefined): void {
    if (this._logLevel > LogLevel.INFO) {
      return;
    }
    console.info({ message, params });
  }

  warning(message: string, params?: object | undefined): void {
    if (this._logLevel > LogLevel.WARNING) {
      return;
    }
    console.warn({ message, params });
  }

  error(message: string, params?: object | undefined): void {
    if (this._logLevel > LogLevel.ERROR) {
      return;
    }
    console.error({ message, params });
  }
}

export type ConsoleLoggerServiceOptions = {
  logLevel: LogLevel;
};

export const getConsoleLoggerService =
  ({ logLevel }: ConsoleLoggerServiceOptions) =>
  () => {
    return new ConsoleLoggerService(logLevel);
  };
