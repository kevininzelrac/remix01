import { add } from "date-fns";

import { Plan, Recurrence } from "~/constants";
import type {
  IClockService,
  IDatabaseService,
  IProductService,
  ServerContext,
} from "~/server/interfaces";
import type { Product } from "~/types";
export class LocalProductService implements IProductService {
  constructor(
    private _databaseService: IDatabaseService,
    private _clockService: IClockService,
    private _productList: Product[],
  ) {}

  getProducts = async (): Promise<Product[]> => {
    return this._productList;
  };

  getProductCheckoutPage = async (
    userId: string,
    productId: string,
    successUrl: string,
    cancelUrl: string,
  ): Promise<string> => {
    // SKIP CHECKOUT
    const product = this._getProductById(productId);
    const tx = this._databaseService.transaction();
    await tx.subscription.upsert({
      create: {
        plan: product.plan,
        expiresAt: this._getProductExpiration(product),
        userId,
      },
      update: {
        plan: product.plan,
        expiresAt: this._getProductExpiration(product),
      },
      where: {
        userId,
      },
    });

    return successUrl;
  };

  _getProductById = (productId: string): Product => {
    for (const item of this._productList) {
      if (item.id === productId) {
        return item;
      }
    }

    throw new Error("Product not found.");
  };

  _getProductExpiration = (product: Product): Date | null => {
    switch (product.recurrence) {
      case Recurrence.ONE_TIME: {
        return null;
      }
      case Recurrence.MONTHLY: {
        return add(this._clockService.getCurrentDateTime(), { months: 1 });
      }
      case Recurrence.YEARLY: {
        return add(this._clockService.getCurrentDateTime(), { years: 1 });
      }
    }
  };
}

const productList: Product[] = [
  {
    id: "free-usd",
    downgradesTo: null,
    name: "Free",
    description: "All the basics for starting a new business.",
    plan: Plan.FREE,
    currency: "USD",
    recurrence: Recurrence.ONE_TIME,
    values: {
      [Recurrence.ONE_TIME]: 0,
      [Recurrence.MONTHLY]: 0,
      [Recurrence.YEARLY]: 0,
    },
    features: ["10 projects", "Basic kanban boards", "2 team members"],
    cta: "Start with Free",
  },
  {
    id: "pro-usd",
    downgradesTo: "free-usd",
    name: "Pro",
    description:
      "For teams that want to track progress and automate workflows.",
    plan: Plan.PRO,
    currency: "USD",
    recurrence: Recurrence.YEARLY,
    values: {
      [Recurrence.ONE_TIME]: 0,
      [Recurrence.MONTHLY]: 5,
      [Recurrence.YEARLY]: 60,
    },
    features: ["Unlimited projects", "Advanced reporting", "10 team members"],
    cta: "Upgrade to Pro",
  },
];

export const getLocalProductService = (
  context: ServerContext,
): LocalProductService => {
  return new LocalProductService(
    context.databaseService,
    context.clockService,
    productList,
  );
};
