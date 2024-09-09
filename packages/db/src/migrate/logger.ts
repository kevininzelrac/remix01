export class Logger {
  constructor(public logs: object[] = []) {}

  debug(message: Record<string, unknown>): void {
    this._addLog("debug", message);
  }

  info(message: Record<string, unknown>): void {
    this._addLog("debug", message);
  }

  warn(message: Record<string, unknown>): void {
    this._addLog("debug", message);
  }

  error(message: Record<string, unknown>): void {
    this._addLog("debug", message);
  }

  flush(): void {
    this.logs = [];
  }

  _addLog(
    level: "debug" | "info" | "warn" | "error",
    message: Record<string, unknown>,
  ): void {
    const timestamp = new Date().toISOString();
    this.logs.push({
      timestamp,
      level,
      message,
    });
  }
}
