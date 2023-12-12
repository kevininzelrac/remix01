import { Editor } from "slate";
import { useSlate } from "slate-react";
import { CustomEditor } from "../slate";

const isMarkActive = (editor: CustomEditor, type: string) => {
  const marks: any = Editor.marks(editor);
  return marks ? marks[type] === true : false;
};

export const toggleMark = (editor: CustomEditor, type: string) => {
  isMarkActive(editor, type)
    ? Editor.removeMark(editor, type)
    : Editor.addMark(editor, type, true);
};

type props = {
  type: string;
};
export default function MarkButton({ type }: props) {
  const editor = useSlate();
  return (
    <button
      className={isMarkActive(editor, type) ? "active" : undefined}
      onMouseDown={() => {
        toggleMark(editor, type);
      }}
    >
      {type}
    </button>
  );
}
