import type { Recurrence } from "~/constants";

export type Product = {
  id: string;
  name: string;
  description: string;
  features: string[];
  cta: string;
  currency: string;
  recurrence: Recurrence;
  values: Record<Recurrence, number>;
};
