export enum Recurrence {
  YEARLY = "yearly",
  MONTHLY = "monthly",
  ONE_TIME = "one-time",
}

export enum Plan {
  FREE = "free",
  PRO = "pro",
}

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
