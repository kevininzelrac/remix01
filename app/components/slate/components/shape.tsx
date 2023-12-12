import { Editor, Element, Transforms } from "slate";
import { useSlate } from "slate-react";
import { CustomEditor } from "../slate";

const isActive = (editor: CustomEditor, name: string) => {
  const [match] = Editor.nodes(editor, {
    match: (node) =>
      !Editor.isEditor(node) &&
      Element.isElement(node) &&
      "shape" in node &&
      node.shape === name,
  });
  return !!match;
};

export default function Shape({ name }: any) {
  const editor = useSlate();

  return (
    <button
      className={isActive(editor, name) ? "active" : undefined}
      onMouseDown={() => {
        if (isActive(editor, name)) {
          Transforms.setNodes(editor, {
            shape: undefined,
          });
          return;
        }
        Transforms.setNodes(editor, {
          shape: name,
        });
      }}
    >
      {name}
    </button>
  );
}
