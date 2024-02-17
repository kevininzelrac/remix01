import type { IClockService } from "~/server/interfaces";

export class ClockService implements IClockService {
  getCurrentDateTime(): Date {
    return new Date();
  }
}
