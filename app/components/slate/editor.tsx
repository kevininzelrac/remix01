import { Slate, Editable, withReact } from "slate-react";
import { createEditor, type Descendant } from "slate";
import { withHistory } from "slate-history";
import { useMemo, useState } from "react";
import { useLocation } from "@remix-run/react";
import { RenderElement, RenderLeaf } from "./render";
import Shortcuts from "./shortcuts";
import Toolbar from "./components/toolbar";

export default function Editor({ children, handleSave }: any) {
  const { pathname } = useLocation();
  const path = pathname.replace("/Edit", "");

  const [isDraft, setIsDraft] = useState(
    localStorage.getItem("slate" + path) ? true : false
  );

  const initialValue: Descendant[] = useMemo(() => {
    if (children.includes("type")) {
      return JSON.parse(children);
    } else {
      return [
        {
          type: "paragraph",
          textAlign: "left",
          children: [{ text: children }],
        },
      ];
    }
  }, []);

  const [editor] = useState(() => withReact(withHistory(createEditor())));
  return (
    <Slate
      editor={editor}
      initialValue={
        localStorage.getItem("slate" + path)
          ? JSON.parse(localStorage.getItem("slate" + path) as string)
          : initialValue
      }
      onChange={(value) => {
        const isAstChange = editor.operations.some(
          (op) => "set_selection" !== op.type
        );

        if (isAstChange) {
          if (JSON.stringify(value) !== JSON.stringify(initialValue)) {
            localStorage.setItem("slate" + path, JSON.stringify(value));
            setIsDraft(true);
          } else {
            localStorage.removeItem("slate" + path);
            setIsDraft(false);
          }
        }
      }}
    >
      <Toolbar
        isDraft={isDraft}
        setIsDraft={setIsDraft}
        handleSave={handleSave}
      />
      <Editable
        autoFocus
        renderElement={RenderElement}
        renderLeaf={RenderLeaf}
        onKeyDown={(e) => {
          Shortcuts(e, editor);
        }}
        /* style={isDraft ? { border: "1px dashed red" } : {}} */
      />
    </Slate>
  );
}
