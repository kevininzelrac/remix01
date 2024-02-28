import { Plan, Product, Recurrence, WizardStep } from "@app/utils/constants";
import { ProductError } from "@app/utils/errors";
import { add } from "date-fns";

import type { IClockService } from "~/types/IClockService";
import type { IDatabaseService } from "~/types/IDatabaseService";
import type { IProductService } from "~/types/IProductService";
import type { IUserService } from "~/types/IUserService";
import type { ServerContext } from "~/types/ServerContext";

export class LocalProductService implements IProductService {
  constructor(
    private _databaseService: IDatabaseService,
    private _userService: IUserService,
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
  ): Promise<string> => {
    // SKIP CHECKOUT
    const product = this._getProductById(productId);
    const tx = this._databaseService.transaction();
    await Promise.all([
      tx.subscription.upsert({
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
      }),
      this._userService.updateUser(userId, {
        wizardStep: WizardStep.COMPLETE,
      }),
    ]);

    return successUrl;
  };

  _getProductById = (productId: string): Product => {
    for (const item of this._productList) {
      if (item.id === productId) {
        return item;
      }
    }

    throw new ProductError("Product not found.");
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

export const getLocalProductService =
  () =>
  (context: ServerContext): LocalProductService => {
    return new LocalProductService(
      context.databaseService,
      context.userService,
      context.clockService,
      productList,
    );
  };
