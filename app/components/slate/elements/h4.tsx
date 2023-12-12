import { ReactNode } from "react";
import { H4Element } from "../slate";

type props = {
  element: H4Element;
  attributes: object;
  children: ReactNode;
};

export default function H4({ element, attributes, children }: props) {
  return (
    <h4
      //className={element.textAlign}
      style={{ textAlign: element.textAlign }}
      {...attributes}
    >
      {children}
    </h4>
  );
}
