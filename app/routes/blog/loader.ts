import { LoaderFunction, LoaderFunctionArgs, defer } from "@remix-run/node";
import { postType } from "./posts";

const getPosts = async (): Promise<{ posts: postType[] }> => {
  const { posts } = await import("./posts");
  await new Promise<void>((resolve) => setTimeout(resolve, 500));
  return { posts: posts };
};

export const loader: LoaderFunction = ({
  request,
  context,
  params,
}: LoaderFunctionArgs) => {
  //const response = getPosts();
  return defer({ response: getPosts() });
};
