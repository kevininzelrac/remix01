import type { IClockService } from "~/types/IClockService";

export class ClockService implements IClockService {
  getCurrentDateTime(): Date {
    return new Date();
  }
}

export const getClockService = () => {
  return new ClockService();
};
