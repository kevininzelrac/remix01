import type { Credential, User } from "@app/db";
import { WizardStep } from "@app/utils/constants";

import type { IDatabaseService } from "~/types/IDatabaseService";
import type { IUserService } from "~/types/IUserService";
import type { ServerContext } from "~/types/ServerContext";

export class UserService implements IUserService {
  constructor(private _databaseService: IDatabaseService) {}

  getById(id: string): Promise<User | null> {
    return this._databaseService.transaction().user.findUnique({
      where: {
        id,
      },
    });
  }

  getByEmail(
    email: string,
  ): Promise<(User & { credential: Credential | null }) | null> {
    return this._databaseService.transaction().user.findUnique({
      where: {
        email,
      },
      include: {
        credential: true,
      },
    });
  }

  getByOAuthProvider(
    providerName: string,
    providerId: string,
  ): Promise<User | null> {
    // Guaranteed unique
    return this._databaseService.transaction().user.findFirst({
      where: {
        oauthProviders: {
          some: {
            providerName,
            providerId,
          },
        },
      },
    });
  }

  createUserWithPassword(email: string, passwordHash: string): Promise<User> {
    return this._databaseService.transaction().user.create({
      data: {
        email: email,
        emailVerifiedAt: null,
        credential: {
          create: {
            passwordHash,
          },
        },
        wizardStep: WizardStep.INITIAL,
      },
    });
  }

  createUserWithOAuthProvider(
    email: string,
    providerName: string,
    providerId: string,
    attributes: Pick<User, "fullName" | "avatar" | "emailVerifiedAt">,
  ): Promise<User> {
    return this._databaseService.transaction().user.create({
      data: {
        ...attributes,
        email: email,
        oauthProviders: {
          create: {
            providerId,
            providerName,
          },
        },
        wizardStep: WizardStep.INITIAL,
      },
    });
  }

  async updateUser(
    id: string,
    attrs: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>,
  ): Promise<User> {
    return this._databaseService.transaction().user.update({
      data: attrs,
      where: {
        id,
      },
    });
  }
}

export const getUserService = () => (context: ServerContext) => {
  return new UserService(context.databaseService);
};
