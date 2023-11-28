import type { Post, PrismaClient } from "~/server/db/interfaces.server";
import type { Dependency } from "~/server/injection";
import type {
  ILoggerService,
  IPostService,
  ServerContext,
} from "~/server/interfaces";

export class PostService implements IPostService, Dependency<ServerContext> {
  private _loggerService!: ILoggerService;

  constructor(private prisma: PrismaClient) {}

  init(context: ServerContext): void {
    this._loggerService = context.loggerService;
  }

  async getPosts(): Promise<Post[] | null> {
    await new Promise<void>((resolve) => setTimeout(resolve, 1000));
    return this.prisma.post.findMany({
      include: {
        author: true,
      },
    });
  }
}
