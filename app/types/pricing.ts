import type { Plan, Recurrence } from "~/constants";
import type { AsEnum } from "~/server/types";

export type Product = {
  id: string;
  downgradesTo: string | null;
  name: string;
  description: string;
  plan: AsEnum<typeof Plan>;
  features: string[];
  cta: string;
  currency: string;
  recurrence: AsEnum<typeof Recurrence>;
  values: Record<AsEnum<typeof Recurrence>, number>;
};
