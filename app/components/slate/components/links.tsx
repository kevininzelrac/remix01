import { Editor, Element, Range, Transforms } from "slate";
import { useSlate } from "slate-react";
import { CustomEditor, LinkElement } from "../slate";

const isActive = (editor: CustomEditor) => {
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && Element.isElement(n) && n.type === "link",
  });
  return !!match;
};

const unwrapLink = (editor: CustomEditor) => {
  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && Element.isElement(n) && n.type === "link",
  });
};

export const wrapLink = (editor: CustomEditor, href: string) => {
  const { isInline } = editor;
  editor.isInline = (element) => {
    return element.type === "link" ? true : isInline(element);
  };

  if (isActive(editor)) {
    unwrapLink(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const link: LinkElement = {
    type: "link",
    href,
    children: isCollapsed ? [{ text: href }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: "end" });
  }
};

export const RemoveLink = () => {
  const editor = useSlate();

  return (
    <button
      className={isActive(editor) ? "active" : undefined}
      onMouseDown={(e) => {
        e.preventDefault();
        if (isActive(editor)) {
          unwrapLink(editor);
        }
      }}
    >
      link
    </button>
  );
};

export const ToggleLink = () => {
  const editor = useSlate();

  return (
    <button
      className={isActive(editor) ? "active" : undefined}
      onMouseDown={(event) => {
        event.preventDefault();
        if (isActive(editor)) {
          unwrapLink(editor);
          return;
        }
        const href = window.prompt("Enter the URL of the link:");
        if (!href) return;
        if (editor.selection) {
          wrapLink(editor, href);
        }
      }}
    >
      {isActive(editor) ? "unLink" : "link"}
    </button>
  );
};
