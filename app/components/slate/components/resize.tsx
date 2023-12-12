import { Transforms } from "slate";
import { useFocused, useSelected, useSlate } from "slate-react";
import { MouseEvent } from "react";

type size = {
  width: number;
  height: number;
};
type props = {
  size: size;
  setSize: any;
};

export default function Resize({ size, setSize }: props) {
  const editor = useSlate();
  const selected = useSelected();
  const focused = useFocused();

  const handleResize = (e: MouseEvent<HTMLButtonElement>) => {
    let newSize: size = size;
    const startSize: size = size;
    const startPosition = {
      y: e.pageY,
      x: e.pageX,
    };

    const onMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
      newSize = {
        width: startSize.width - startPosition.x + e.pageX,
        height: e.shiftKey
          ? startSize.width - startPosition.x + e.pageX
          : startSize.height - startPosition.y + e.pageY,
      };
      setSize(newSize);
    };

    const onMouseUp = () => {
      Transforms.setNodes(editor, {
        width: newSize.width,
        height: newSize.height,
      });
      document.body.removeEventListener("mousemove", onMouseMove as any);
    };

    document.body.addEventListener("mousemove", onMouseMove as any);
    document.body.addEventListener("mouseup", onMouseUp, { once: true });
  };

  return (
    <button
      className="resize"
      style={{
        display: selected && focused ? "flex" : "none",
      }}
      onMouseDown={handleResize}
    >
      <div>{size.width}</div>
      <div>{size.height}</div>
    </button>
  );
}
