import type { IClockService } from "~/server/interfaces/IClockService.server";
import type { ServerContext } from "~/server/interfaces/ServerContext.server";

export class ClockService implements IClockService {
  getCurrentDateTime(): Date {
    return new Date();
  }
}

export const getClockService = (context: ServerContext) => {
  return new ClockService();
};
