import { useSlate } from "slate-react";

export const UndoButton = () => {
  const editor = useSlate();
  return (
    <button
      onMouseDown={() => {
        editor.undo();
      }}
    >
      undo
    </button>
  );
};

export const RedoButton = () => {
  const editor = useSlate();
  return (
    <button
      onMouseDown={() => {
        editor.redo();
      }}
    >
      redo
    </button>
  );
};
