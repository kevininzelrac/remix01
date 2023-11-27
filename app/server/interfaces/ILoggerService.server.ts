export interface ILoggerService {
  debug(message: string, params?: object): void;
  info(message: string, params?: object): void;
  warning(message: string, params?: object): void;
  error(message: string, params?: object): void;
}
