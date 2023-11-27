import type { PrismaClient, User } from "~/server/db/interfaces";
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

  getByEmail(email: string): Promise<User | null> {
    return this._db.user.findUnique({
      where: {
        email,
      },
    });
  }

  getByEmailPasswordCombination(
    email: string,
    password: string,
  ): Promise<User | null> {
    throw new Error("Method not implemented.");
  }
}
