import type {
  Credential,
  PrismaClient,
  User,
} from "~/server/db/interfaces.server";
import type { Dependency } from "~/server/injection";
import type {
  ILoggerService,
  IUserService,
  ServerContext,
} from "~/server/interfaces";

export class UserService implements IUserService, Dependency<ServerContext> {
  private _loggerService!: ILoggerService;

  constructor(private _db: PrismaClient) {}

  init(context: ServerContext): void {
    this._loggerService = context.loggerService;
  }

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

  async createUserWithPassword(
    email: string,
    passwordHash: string,
  ): Promise<User> {
    return this._db.user.create({
      data: {
        email: email,
        credential: {
          create: {
            passwordHash,
          },
        },
      },
    });
  }

  createUserWithOAuthProvider(
    email: string,
    providerName: string,
    providerId: string,
  ): Promise<User> {
    return this._db.user.create({
      data: {
        email: email,
        oauthProviders: {
          create: {
            providerId,
            providerName,
          },
        },
      },
    });
  }
}
