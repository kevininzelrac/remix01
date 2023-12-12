import { Editor, Element, Transforms } from "slate";
import { useSlate } from "slate-react";
import { CustomEditor, float } from "../slate";

const isActive = (editor: CustomEditor, float: float) => {
  const [match] = Editor.nodes(editor, {
    match: (node: any) =>
      !Editor.isEditor(node) &&
      Element.isElement(node) &&
      "float" in node &&
      node.float === float,
  });
  return !!match;
};

type props = {
  float: float;
};
export default function Float({ float }: props) {
  const editor = useSlate();

  return (
    <button
      className={isActive(editor, float) ? "active" : undefined}
      onMouseDown={() => {
        if (isActive(editor, float)) {
          Transforms.setNodes(editor, {
            float: undefined,
          });
          return;
        }
        Transforms.setNodes(editor, {
          float: float,
        });
      }}
    >
      {float}
    </button>
  );
}
