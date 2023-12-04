import type { PrismaClient, User } from "~/server/db/interfaces.server";
import type { Dependency } from "~/server/injection";
import type {
  ILoggerService,
  IUserService,
  ServerContext,
} from "~/server/interfaces";
import bcrypt from "bcryptjs";

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

  getByEmail(email: string): Promise<User | null> {
    return this._db.user.findUnique({
      where: {
        email,
      },
      include: {
        Credential: true,
      },
    });
  }

  async getByEmailPasswordCombination(
    email: string,
    password: string
  ): Promise<User | null> {
    const user = await this._db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) throw new Error("Incorrect email or password.");

    const credential = await this._db.credential.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        passwordHash: true,
      },
    });

    if (!credential) throw new Error("Credential not found for user.");

    const match = bcrypt.compare(password, credential.passwordHash!);

    if (!match) throw new Error("Incorrect email or password.");

    return user;
  }

  async putNewUser(
    firstname: string,
    lastname: string,
    email: string,
    passwordHash: string
  ): Promise<{ email: String; passwordHash: string } | null> {
    await this._db.user.upsert({
      where: { email: email },
      update: {},
      create: {
        email: email,
        fullName: firstname + " " + lastname,
        firstname: firstname,
        lastname: lastname,
        avatar: "https://picsum.photos/50",
        Credential: {
          create: {
            passwordHash: passwordHash,
          },
        },
      },
    });
    return {
      email,
      passwordHash,
    };
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
    avatar: string
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
