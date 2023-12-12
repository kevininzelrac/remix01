import { ReactNode } from "react";
import { H3Element } from "../slate";

type props = {
  element: H3Element;
  attributes: object;
  children: ReactNode;
};

export default function H3({ element, attributes, children }: props) {
  return (
    <h3
      //className={element.textAlign}
      style={{ textAlign: element.textAlign }}
      {...attributes}
    >
      {children}
    </h3>
  );
}
