import { Editor, Element, Transforms } from "slate";
import { useSlate } from "slate-react";
import { CustomEditor, CustomElement } from "../slate";

const isBlockActive = (editor: CustomEditor, type: CustomElement["type"]) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Editor.nodes(editor, {
    at: Editor.unhangRange(editor, selection),
    match: (node: any) =>
      !Editor.isEditor(node) && Element.isElement(node) && node.type === type,
  });
  return !!match;
};

export const wrapBlock = (
  editor: CustomEditor,
  type: CustomElement["type"]
) => {
  Transforms.unwrapNodes(editor, {
    match: (node) =>
      !Editor.isEditor(node) &&
      Element.isElement(node) &&
      ["ul", "ol"].includes(node.type),
    split: true,
  });

  Transforms.setNodes(editor, {
    type: isBlockActive(editor, type)
      ? "paragraph"
      : ["ul", "ol"].includes(type)
      ? "li"
      : type,
    textAlign: undefined,
    children: [],
  });

  if (!isBlockActive(editor, type) && ["ul", "ol"].includes(type)) {
    Transforms.wrapNodes(editor, {
      type: type as "ul" | "ol",
      textAlign: undefined,
      children: [],
    });
  }
};

export default function BlockButton({ type }: { type: CustomElement["type"] }) {
  const editor = useSlate();

  return (
    <button
      className={isBlockActive(editor, type) ? "active" : undefined}
      onMouseDown={() => {
        wrapBlock(editor, type);
      }}
    >
      {type}
    </button>
  );
}
