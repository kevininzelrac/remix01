import type { IOAuthProviderService } from "./IOAuthProviderService.js";

export interface IOAuthProviderFactoryService {
  getProvider(providerName: string): IOAuthProviderService;
}
