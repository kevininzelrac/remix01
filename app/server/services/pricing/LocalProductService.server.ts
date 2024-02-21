import { Plan, Recurrence } from "~/constants";
import type { IProductService, ServerContext } from "~/server/interfaces";
import type { Product } from "~/types";

export class LocalProductService implements IProductService {
  constructor(private _productList: Product[]) {}

  getProducts = async (): Promise<Product[]> => {
    return this._productList;
  };

  getProductCheckoutPage = async (
    productId: string,
    successUrl: string,
    cancelUrl: string,
  ): Promise<string> => {
    // SKIP CHECKOUT
    // const product = this._getProductById(productId);
    return successUrl;
  };

  _getProductById = async (productId: string): Promise<Product> => {
    for (const item of this._productList) {
      if (item.id === productId) {
        return item;
      }
    }

    throw new Error("Product not found.");
  };
}

const productList = [
  {
    id: "free-usd",
    name: "Free",
    description: "All the basics for starting a new business.",
    plan: Plan.FREE,
    currency: "USD",
    recurrence: Recurrence.MONTHLY,
    values: {
      [Recurrence.MONTHLY]: 0,
      [Recurrence.YEARLY]: 0,
    },
    features: ["10 projects", "Basic kanban boards", "2 team members"],
    cta: "Start with Free",
  },
  {
    id: "pro-usd",
    name: "Pro",
    description:
      "For teams that want to track progress and automate workflows.",
    plan: Plan.PRO,
    currency: "USD",
    recurrence: Recurrence.YEARLY,
    values: {
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
  return new LocalProductService(productList);
};
