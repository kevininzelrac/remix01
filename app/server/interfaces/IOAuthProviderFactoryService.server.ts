import type { IOAuthProviderService } from "./IOAuthProviderService.server";

export interface IOAuthProviderFactoryService {
  getProvider(providerName: string): IOAuthProviderService;
}
