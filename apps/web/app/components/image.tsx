import type { ImageProps as ServerImageProps } from "server-image-react";
import { Image as ServerImage } from "server-image-react";

export type ImageProps = Omit<ServerImageProps, "loader" | "unoptimized">;

export const Image = (props: ImageProps) => <ServerImage {...props} />;
