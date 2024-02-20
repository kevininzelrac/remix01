import type { ImageProps as ServerImageProps } from "server-image-react";
import { serverImageLoader } from "server-image-loader-server";
import { Image as ServerImage } from "server-image-react";

export type ImageProps = Omit<ServerImageProps, "loader" | "unoptimized">;

export const Image = (props: ImageProps) => (
  <ServerImage loader={serverImageLoader} {...props} />
);
