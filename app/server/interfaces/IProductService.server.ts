import type { Product } from "~/types";

export interface IProductService {
  getProducts(): Promise<Product[]>;
  getProductCheckoutPage(
    userId: string,
    productId: string,
    successUrl: string,
    cancelUrl: string,
  ): Promise<string>;
}
