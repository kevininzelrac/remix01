import type { Dependency } from "~/server/injection";
import type { IClockService, ServerContext } from "~/server/interfaces";

export class ClockService implements IClockService, Dependency<ServerContext> {
  init(context: ServerContext): void {}

  getCurrentDateTime(): Date {
    return new Date();
  }
}
