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

  async putRefreshToken(userId: string, token: string): Promise<string | null> {
    const existingRefreshToken = await this._db.refreshToken.findFirst({
      where: {
        userId: userId,
        revoked: false,
      },
    });

    if (existingRefreshToken) {
      return existingRefreshToken.token;
    } else {
      const newRefreshToken = await this._db.refreshToken.create({
        data: {
          userId: userId,
          token: token,
          revoked: false,
        },
      });

      return newRefreshToken.token;
    }
  }

  async getRefreshToken(userId: string, token: string): Promise<string | null> {
    const refresh = await this._db.refreshToken.findFirst({
      where: {
        userId: userId,
        token: token,
        revoked: false,
      },
    });
    if (!refresh) return null;

    return refresh!.token;
  }

  async revokeRefreshToken(userId: string, token: string): Promise<void> {
    await this._db.refreshToken.update({
      where: {
        userId: userId,
        token: token,
      },
      data: {
        revoked: true,
      },
    });
  }

  async signGoogleUser(
    id: string,
    email: string,
    firstname: string,
    lastname: string,
    avatar: string,
  ): Promise<User | null> {
    const user = await this._db.user.upsert({
      where: { email: email },
      update: { avatar: avatar },
      create: {
        email: email,
        fullName: firstname + " " + lastname,
        firstname: firstname,
        lastname: lastname,
        avatar: avatar,
      },
    });

    return user;
  }
}
