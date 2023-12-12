import { ReactNode, useRef, useState } from "react";
import { ReactEditor, useFocused, useSelected, useSlate } from "slate-react";
import { Transforms } from "slate";
import Resize from "../components/resize";
import { ImageElement } from "../slate";
import Tools from "../components/tools";

type props = {
  element: ImageElement;
  attributes: object;
  children: ReactNode;
};
export default function Image({ attributes, children, element }: props) {
  const { breakLine, float, shape, height, width } = element;
  const editor = useSlate();
  const selected = useSelected();
  const focused = useFocused();
  const path = ReactEditor.findPath(editor, element);

  const ref: any = useRef(null);

  const [size, setSize]: any = useState(() => {
    if (!width || typeof width !== "number") {
      Transforms.setNodes(
        editor,
        {
          width: 180,
          height: 180,
        },
        { at: path }
      );
      return {
        width: 180,
        height: 180,
      };
    } else {
      return {
        width: width,
        height: height,
      };
    }
  });

  return (
    <>
      {breakLine && <div style={{ clear: "both" }}></div>}
      <div
        ref={ref}
        contentEditable={false}
        className="image"
        style={{
          width: size.width,
          boxShadow: selected && focused ? "0 0 0 3px #B4D5FF" : " none ",
          float: float || "none",
          clear: float ? "none" : "both",
          borderRadius: shape ? "50%" : "",
          shapeOutside: shape ? "circle()" : "",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "6px",
          zIndex: "1",
          //width: pxTo100(size.width, ref?.current?.parentElement?.offsetWidth),
          /* height: size.height ? size.height + "px" : "auto", */
          /* height: "clamp('46%,'" + size.height + "px, 100%", */
        }}
        //className={"image " + (shape || "") + " " + (float || "clearBoth")}
      >
        <img
          src={element?.src}
          style={{
            position: "relative",
            borderRadius: "inherit",
            width: "100%",
            height: "100%",
            cursor: "text",
          }}
          {...attributes}
          alt="page img"
        />
        {children}
        <Tools />
        {size.width && <Resize size={size} setSize={setSize} />}
      </div>
    </>
  );
}
