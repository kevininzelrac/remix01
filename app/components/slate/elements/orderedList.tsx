import { ReactNode } from "react";
import { OrderedListElement } from "../slate";

type props = {
  element: OrderedListElement;
  attributes: object;
  children: ReactNode;
};
export default function OrderedList({ element, attributes, children }: props) {
  return (
    <ol
      //className={element.textAlign}
      style={{ textAlign: element.textAlign }}
      {...attributes}
    >
      {children}
    </ol>
  );
}
