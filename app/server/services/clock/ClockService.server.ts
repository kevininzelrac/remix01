import type { IClockService, ServerContext } from "~/server/interfaces";

export class ClockService implements IClockService {
  getCurrentDateTime(): Date {
    return new Date();
  }
}

export const getClockService = (context: ServerContext) => {
  return new ClockService();
};
