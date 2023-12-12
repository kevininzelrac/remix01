import Image from "./elements/image";
import Youtube from "./elements/youtube";
import Paragraph from "./elements/paragraph";
import Link from "./elements/link";
import H2 from "./elements/h2";
import H3 from "./elements/h3";
import H4 from "./elements/h4";
import BlockQuote from "./elements/blockquote";
import BulletedList from "./elements/bulletedList";
import OrderedList from "./elements/orderedList";
import ListItem from "./elements/listItem";
import { RenderLeafProps } from "slate-react";

export const RenderElement = (props: any) => {
  switch (props.element.type) {
    case "paragraph":
      return <Paragraph {...props} />;

    case "h2":
      return <H2 {...props} />;

    case "h3":
      return <H3 {...props} />;

    case "h4":
      return <H4 {...props} />;

    case "blockquote":
      return <BlockQuote {...props} />;

    case "ul":
      return <BulletedList {...props} />;

    case "ol":
      return <OrderedList {...props} />;

    case "li":
      return <ListItem {...props} />;

    case "link":
      return <Link {...props} />;
    case "image":
      return <Image {...props} />;
    case "youtube":
      return <Youtube {...props} />;
    default:
      return <Paragraph {...props} />;
  }
};

export const RenderLeaf = ({ children, attributes, leaf }: RenderLeafProps) => {
  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.italic) children = <em>{children}</em>;
  if (leaf.code) children = <code>{children}</code>;
  if (leaf.underline) children = <u>{children}</u>;
  return <span {...attributes}>{children}</span>;
};
