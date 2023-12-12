import { ReactNode } from "react";
import { ParagraphElement } from "../slate";

type props = {
  element: ParagraphElement;
  attributes: object;
  children: ReactNode;
};
export default function Paragraph({ element, attributes, children }: props) {
  return (
    <p
      //className={element.textAlign}
      style={{ textAlign: element.textAlign }}
      {...attributes}
    >
      {children}
    </p>
  );
}
