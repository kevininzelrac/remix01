import { ReactNode } from "react";
import { BlockQuoteElement } from "../slate";

type props = {
  element: BlockQuoteElement;
  attributes: object;
  children: ReactNode;
};
export default function BlockQuote({ element, attributes, children }: props) {
  return (
    <blockquote
      style={{
        marginLeft: "10px",
        paddingLeft: "10px",
        borderLeft: "3px solid lightGray",
        textAlign: element?.textAlign,
      }}
      //className={element.textAlign}
      {...attributes}
    >
      <i>{children}</i>
    </blockquote>
  );
}
