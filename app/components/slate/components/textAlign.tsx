import { Editor, Element, Transforms } from "slate";
import { useSlate } from "slate-react";
import { CustomEditor } from "../slate";

const isActive = (editor: CustomEditor, textAlign: string) => {
  const [match] = Editor.nodes(editor, {
    match: (node) =>
      !Editor.isEditor(node) &&
      Element.isElement(node) &&
      "textAlign" in node &&
      node.textAlign === textAlign,
  });
  return !!match;
};

export default function TextAlign({ textAlign }: any) {
  const editor = useSlate();

  return (
    <button
      className={isActive(editor, textAlign) ? "active" : undefined}
      onMouseDown={(e) => {
        e.preventDefault();
        if (isActive(editor, textAlign)) {
          Transforms.setNodes(editor, { textAlign: undefined });
        }
        Transforms.setNodes(editor, { textAlign });
      }}
    >
      {textAlign}
    </button>
  );
}
