import { ReactNode } from "react";
import { BulletedListElement } from "../slate";

type props = {
  element: BulletedListElement;
  attributes: object;
  children: ReactNode;
};
export default function BulletedList({ element, attributes, children }: props) {
  return (
    <ul
      //className={element.textAlign}
      style={{ textAlign: element.textAlign }}
      {...attributes}
    >
      {children}
    </ul>
  );
}
