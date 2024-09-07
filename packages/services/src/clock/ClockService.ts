import type { IClockService } from "../types/IClockService.js";

export class ClockService implements IClockService {
  getCurrentDateTime(): Date {
    return new Date();
  }
}

export const getClockService = () => () => {
  return new ClockService();
};
