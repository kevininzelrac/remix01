export enum LogLevel {
  DEBUG = 10,
  INFO = 20,
  WARNING = 30,
  ERROR = 40,
}

export interface ILoggerService {
  debug(message: string, params?: object): void;
  info(message: string, params?: object): void;
  warning(message: string, params?: object): void;
  error(message: string, params?: object): void;
}
