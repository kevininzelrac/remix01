import { ReactNode } from "react";
import { ListItemElement } from "../slate";

type props = {
  element: ListItemElement;
  attributes: object;
  children: ReactNode;
};
export default function ListItem({ element, attributes, children }: props) {
  return (
    <li
      //className={element.textAlign}
      style={{ textAlign: element.textAlign }}
      {...attributes}
    >
      {children}
    </li>
  );
}
