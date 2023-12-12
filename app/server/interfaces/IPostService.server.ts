import { Post } from "@prisma/client";

type PostWithAuthor = {
  id: string;
  type: string;
  category: string;
  title: string;
  authorId: string;
  content: string;
  author: {
    firstname: string;
    lastname: string;
    avatar: string;
  };
};

export interface IPostService {
  getNav(): Promise<{ title: string; type: string; category: string }[] | null>;
  getPost(category: string, title: string): Promise<PostWithAuthor | null>;
  getPosts(): Promise<PostWithAuthor[] | null>;
  getPostsByCategory(category: string): Promise<PostWithAuthor[] | null>;
  getCategories(): Promise<{ title: string; type: string }[] | null>;
  getPage(title: string): Promise<PostWithAuthor | null>;
  updatePost(
    id: string,
    type: string,
    category: string,
    content: string
  ): Promise<Post | null>;
  deletePost(id: string): Promise<Post | null>;
  createPost({
    authorId,
    type,
    title,
    category,
    content,
  }: {
    authorId: string;
    type: string;
    title: string;
    category: string;
    content: string;
  }): Promise<Post>;
}
