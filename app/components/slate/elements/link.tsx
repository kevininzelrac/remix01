import { ReactNode } from "react";
import { LinkElement, ParagraphElement } from "../slate";

type props = {
  element: LinkElement;
  attributes: object;
  children: ReactNode;
};
export default function Link({ element, attributes, children }: props) {
  return (
    <a
      href={
        element.href.includes("http://")
          ? element.href
          : "http://" + element.href
      }
      target="_blank"
      rel="noreferrer noopener"
      //className={element.textAlign}
      style={{ textAlign: element.textAlign }}
      {...attributes}
    >
      {children}
    </a>
  );
}
