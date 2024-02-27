import type { Plan, Recurrence } from "@app/utils/constants";

export type Product = {
  id: string;
  downgradesTo: string | null;
  name: string;
  description: string;
  plan: Plan;
  features: string[];
  cta: string;
  currency: string;
  recurrence: Recurrence;
  values: Record<Recurrence, number>;
};
