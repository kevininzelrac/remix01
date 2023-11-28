import type { Post } from "~/server/db/interfaces.server";

export interface IPostService {
  getPosts(): Promise<Post[] | null>;
}
