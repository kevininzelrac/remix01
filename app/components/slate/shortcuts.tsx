import { Transforms } from "slate";
import { CustomEditor, ParagraphElement } from "./slate";
import { toggleMark } from "./components/marks";
import { wrapLink } from "./components/links";

export default function Shortcuts(
  e: React.KeyboardEvent,
  editor: CustomEditor
) {
  if (e.key === "Enter" /* && e.shiftKey */) {
    e.preventDefault();
    const newLine: ParagraphElement = {
      type: "paragraph",
      textAlign: "left",
      children: [{ text: "" }],
    };
    Transforms.insertNodes(editor, newLine);
  }

  if (!e.metaKey) {
    return;
  }

  switch (e.key) {
    case "`": {
      e.preventDefault();
      toggleMark(editor, "blockquote");
      break;
    }
    case "b": {
      e.preventDefault();
      toggleMark(editor, "bold");
      break;
    }
    case "i": {
      e.preventDefault();
      toggleMark(editor, "italic");
      break;
    }
    case "u": {
      e.preventDefault();
      toggleMark(editor, "underline");
      break;
    }
    case "l": {
      e.preventDefault();
      const href = prompt("Enter a URL");
      href && wrapLink(editor, href);
      break;
    }
    default:
      return;
  }
}
