import { WIZARD_STEP } from "~/constants";
import type {
  Credential,
  DatabaseClient,
  User,
} from "~/server/db/interfaces.server";
import type { ILoggerService, IUserService } from "~/server/interfaces";

export class UserService implements IUserService {
  constructor(
    private _db: DatabaseClient,
    private _loggerService: ILoggerService,
  ) {}

  getById(id: string): Promise<User | null> {
    return this._db.user.findUnique({
      where: {
        id,
      },
    });
  }

  getByEmail(
    email: string,
  ): Promise<(User & { credential: Credential | null }) | null> {
    return this._db.user.findUnique({
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
    return this._db.user.findFirst({
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
    return this._db.user.create({
      data: {
        email: email,
        emailVerifiedAt: null,
        credential: {
          create: {
            passwordHash,
          },
        },
        wizardStep: WIZARD_STEP.INITIAL,
      },
    });
  }

  createUserWithOAuthProvider(
    email: string,
    providerName: string,
    providerId: string,
    attributes: Pick<User, "fullName" | "avatar" | "emailVerifiedAt">,
  ): Promise<User> {
    return this._db.user.create({
      data: {
        ...attributes,
        email: email,
        oauthProviders: {
          create: {
            providerId,
            providerName,
          },
        },
        wizardStep: WIZARD_STEP.INITIAL,
      },
    });
  }

  async updateUser(
    id: string,
    attrs: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>,
  ): Promise<User> {
    return this._db.user.update({
      data: attrs,
      where: {
        id,
      },
    });
  }
}
