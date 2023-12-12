import { useFocused, useSelected } from "slate-react";
import Float from "./float";
import Shape from "./shape";

export default function Tools() {
  const selected = useSelected();
  const focused = useFocused();
  return (
    <div
      className="tools"
      style={{
        display: selected && focused ? "flex" : "none",
      }}
    >
      <Float float="left" />
      <Float float="right" />
      <Shape name="circle" />
    </div>
  );
}
