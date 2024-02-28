import type { IOAuthProviderService } from "./IOAuthProviderService";

export interface IOAuthProviderFactoryService {
  getProvider(providerName: string): IOAuthProviderService;
}
