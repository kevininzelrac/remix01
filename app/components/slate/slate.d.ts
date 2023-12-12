import { BaseRange, BaseEditor } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor } from "slate-react";

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText | EmptyText;
    Range: BaseRange & {
      [key: string]: unknown;
    };
  }
}
export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

export type EmptyText = {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
  text: string;
};

export type CustomText = {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
  text: string;
};

export type textAlign =
  | "start"
  | "end"
  | "left"
  | "right"
  | "center"
  | "justify"
  | "match-parent";

export type float = "left" | "right" | "none";

export type ParagraphElement = {
  type: "paragraph";
  textAlign: textAlign;
  children: CustomText[];
};

export type H2Element = {
  type: "h2";
  textAlign?: textAlign;
  children: CustomText[];
};

export type H3Element = {
  type: "h3";
  textAlign?: textAlign;
  children: CustomText[];
};

export type H4Element = {
  type: "h4";
  textAlign?: textAlign;
  children: CustomText[];
};

export type BlockQuoteElement = {
  type: "blockquote";
  textAlign?: textAlign;
  children: CustomText[];
};

export type BulletedListElement = {
  type: "ul";
  textAlign?: textAlign;
  children: CustomText[];
};

export type OrderedListElement = {
  type: "ol";
  textAlign?: textAlign;
  children: CustomText[];
};

export type ListItemElement = {
  type: "li";
  textAlign?: textAlign;
  children: CustomText[];
};

export type LinkElement = {
  type: "link";
  href: string;
  textAlign?: textAlign;
  children: CustomText[];
};

export type ImageElement = {
  type: "image";
  src: string;
  float: float;
  shape: string;
  width: number;
  height: number;
  breakLine?: string;
  children: EmptyText[];
};

export type YoutubeElement = {
  type: "youtube";
  src: string;
  float: float;
  shape: string;
  width: number;
  height: number;
  breakLine?: string;
  children: EmptyText[];
};

export type VoidElement = ImageElement | YoutubeElement;

export type CustomElement =
  | ParagraphElement
  | H2Element
  | H3Element
  | H4Element
  | BlockQuoteElement
  | BulletedListElement
  | OrderedListElement
  | ListItemElement
  | LinkElement
  | ImageElement
  | YoutubeElement;
