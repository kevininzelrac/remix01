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

  async getPosts() {
    //await new Promise<void>((resolve) => setTimeout(resolve, 1000));
    return this.prisma.post.findMany({
      where: {
        type: "post",
      },
      select: {
        id: true,
        type: true,
        category: true,
        authorId: true,
        title: true,
        content: true,
        author: {
          select: {
            firstname: true,
            lastname: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }
  async getPostsByCategory(category: string) {
    return this.prisma.post.findMany({
      where: {
        type: "post",
        category: category,
      },
      select: {
        id: true,
        type: true,
        category: true,
        authorId: true,
        title: true,
        content: true,
        author: {
          select: {
            firstname: true,
            lastname: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  async getPost(category: string, title: string) {
    return this.prisma.post.findFirst({
      where: {
        type: "post",
        category: category,
        title: title,
      },
      select: {
        id: true,
        type: true,
        category: true,
        authorId: true,
        title: true,
        content: true,
        author: {
          select: {
            firstname: true,
            lastname: true,
            avatar: true,
          },
        },
      },
    });
  }
  async getPage(title: string) {
    return this.prisma.post.findFirst({
      where: {
        title: title,
      },
      select: {
        id: true,
        type: true,
        category: true,
        authorId: true,
        title: true,
        content: true,
        author: {
          select: {
            firstname: true,
            lastname: true,
            avatar: true,
          },
        },
      },
    });
  }

  async createPost({ authorId, type, title, category, content }: Post) {
    return await this.prisma.post.create({
      data: {
        authorId,
        type,
        title,
        category,
        content,
      },
    });
  }

  async updatePost(
    id: string,
    type: string,
    category: string,
    content: string
  ) {
    return await this.prisma.post.update({
      where: {
        id: id,
      },
      data: {
        type: type,
        category: category,
        content: content,
      },
    });
  }

  async deletePost(id: string) {
    const categoryPost = await this.prisma.post.findUnique({
      where: {
        id: id,
      },
    });

    if (!categoryPost) {
      throw new Error(`category post with id ${id} not found.`);
    }

    const children = await this.prisma.post.findMany({
      where: {
        category: categoryPost.title,
      },
    });

    for (const child of children) {
      await this.deletePost(child.id);
    }

    return await this.prisma.post.delete({
      where: {
        id: id,
      },
    });
  }

  async getCategories() {
    return await this.prisma.post.findMany({
      where: {
        type: "category",
      },
      select: {
        title: true,
        type: true,
      },
      distinct: ["title"],
      orderBy: {
        title: "asc",
      },
    });
  }

  async getNav() {
    const nav = await this.prisma.post.findMany({
      where: {
        type: {
          in: ["page", "category"],
        },
      },
      select: {
        title: true,
        type: true,
        category: true,
      },
      distinct: ["title"],
      // orderBy: {
      //   title: "asc",
      // },
    });
    const recursive = (data: any, cat: string) =>
      data
        .filter(({ category }: any) => category == cat)
        .map(({ title, type, category }: Post) => ({
          title,
          type,
          category,
          children: recursive(data, title),
        }));

    return recursive(nav, "page");
  }
}
