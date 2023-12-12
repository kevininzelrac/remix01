import { ReactNode } from "react";
import { H2Element } from "../slate";

type props = {
  element: H2Element;
  attributes: object;
  children: ReactNode;
};

export default function H2({ element, attributes, children }: props) {
  return (
    <h2
      //className={element.textAlign}
      style={{ textAlign: element.textAlign }}
      {...attributes}
    >
      {children}
    </h2>
  );
}
