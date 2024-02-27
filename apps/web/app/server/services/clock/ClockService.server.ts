import type { IClockService } from "~/server/interfaces/IClockService.server";

export class ClockService implements IClockService {
  getCurrentDateTime(): Date {
    return new Date();
  }
}

export const getClockService = () => {
  return new ClockService();
};
