import type { Product } from "~/types";

export interface IProductService {
  getProducts(): Promise<Product[]>;
  getProductCheckoutPage(
    productId: string,
    successUrl: string,
    cancelUrl: string,
  ): Promise<string>;
}
