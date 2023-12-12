import { ReactNode, useEffect, useRef, useState } from "react";
import { ReactEditor, useFocused, useSelected, useSlate } from "slate-react";
import { Transforms } from "slate";
import Resize from "../components/resize";
import { useLocation } from "@remix-run/react";
import { YoutubeElement } from "../slate";
import Tools from "../components/tools";

type props = {
  element: YoutubeElement;
  attributes: object;
  children: ReactNode;
};

export default function Youtube({ attributes, children, element }: props) {
  const { breakLine, float, shape, height, width } = element;
  const editor = useSlate();
  const selected = useSelected();
  const focused = useFocused();
  const path = ReactEditor.findPath(editor, element);
  const { pathname }: any = useLocation();

  const _url = new URL(element.src);
  const [url, setUrl] = useState("");

  const ref = useRef(null);
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

  useEffect(() => {
    if (!width || typeof width !== "number") {
      setSize({
        width: 600,
        height: 337,
      });
      Transforms.setNodes(
        editor,
        {
          width: 600,
          height: 337,
        },
        {
          at: path,
          // editor.children.indexOf(element)
        }
      );
    } else {
      setSize({
        width: width,
        height: height,
      });
    }
  }, []);

  useEffect(() => {
    if (element.src.includes("watch?v=")) {
      setUrl(element.src.replace("watch?v=", "embed/"));
    }
    if (element.src.includes("embed")) {
      setUrl(element.src);
    } else if (element.src.includes("youtu.be")) {
      setUrl("https://www.youtube.com/embed/" + _url.pathname);
    }
  }, [_url.pathname, element.src]);
  console.log;

  return (
    <>
      {breakLine && <div style={{ clear: "both" }}></div>}
      <div
        ref={ref}
        contentEditable={false}
        className="youtube"
        style={{
          boxShadow: selected && focused ? "0 0 0 3px #B4D5FF" : " none ",
          float: float || "none",
          clear: float ? "none" : "both",
          borderRadius: shape ? "50%" : "",
          shapeOutside: shape ? "circle()" : "",
          //
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: "1",
          width: "fit-content",
          height: "fit-content",
          maxWidth: "100%",
          /* maxWidth:
          (
            (size.width / ref.current?.parentElement.offsetWidth) *
            100
            ).toFixed(2) + "%", */
          /* width: size.width + "px", */
          /* height: size.height + "px", */
        }}
        //className={"youtube " + (shape || "") + " " + (float || "clearBoth")}
      >
        <iframe
          src={url}
          {...attributes}
          title="YouTube video player"
          width={size.width}
          height={size.height}
          //allowFullScreen
          style={{
            pointerEvents: pathname.includes("Edit") ? "none" : "auto",
            position: "relative",
            borderRadius: "inherit",
            cursor: "text",
            border: "none",
          }}
        />
        {children}
        <Tools />
        {size.width && <Resize size={size} setSize={setSize} />}
      </div>
    </>
  );
}
