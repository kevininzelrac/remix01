import { Editor, Element, Transforms } from "slate";
import { useSlate } from "slate-react";
import { CustomEditor } from "../slate";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router-dom";

const isActive = (editor: CustomEditor, type: string) => {
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && Element.isElement(n) && n.type === type,
  });
  return !!match;
};

const isVoidUrl = (url: string, type: any) => {
  if (!url) return false;
  const _url = new URL(url);

  switch (type) {
    case "image":
      const image = _url.pathname.split(".").pop();
      return ["jpg", "png"].includes(image as string);
    case "youtube":
      return ["www.youtube.com", "youtu.be"].includes(_url.host);
    default:
      break;
  }
};

const insertVoid = (
  editor: CustomEditor,
  src: string,
  type: "image" | "youtube"
) => {
  Transforms.insertNodes(editor, {
    type,
    src,
    width: 180,
    height: 180,
    float: "none",
    shape: "",
    children: [{ text: "" }],
  });
};

export const RemoveVoid = () => {
  const editor = useSlate();
  return <button onClick={() => Transforms.removeNodes(editor)}>delete</button>;
};

export default function AddVoid({ type }: { type: "image" | "youtube" }) {
  const editor = useSlate();

  const { isVoid } = editor;
  editor.isVoid = (element) => {
    return element.type === type ? true : isVoid(element);
  };
  const [display, setDisplay] = useState(false);

  return (
    <>
      {display ? (
        <Dialog editor={editor} handleClose={() => setDisplay(false)} />
      ) : null}
      <button
        className={isActive(editor, type) ? "active" : undefined}
        onMouseDown={() => {
          if (isActive(editor, type)) {
            Transforms.removeNodes(editor);
          } else {
            if (type === "image") {
              setDisplay(true);
            } else {
              const src = window.prompt("Enter the " + type + " URL");
              if (src && !isVoidUrl(src, type)) {
                return alert("Enter a correct " + type + " url");
              }
              src && insertVoid(editor, src, type);
            }
          }
        }}
      >
        {type.includes("image")
          ? isActive(editor, type)
            ? "delete"
            : type
          : type}
      </button>
    </>
  );
}

const Dialog = ({
  editor,
  handleClose,
}: {
  editor: CustomEditor;
  handleClose: () => void;
}) => {
  const fetcher = useFetcher();
  const [src, setSrc] = useState<string>("");
  useEffect(() => {
    if (fetcher.data && fetcher.state === "idle") {
      insertVoid(editor, fetcher.data.url, "image");
      handleClose();
    }
  }, [fetcher.data, fetcher.state]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    insertVoid(editor, src, "image");
    handleClose();
    setSrc("");
  };
  return (
    <dialog>
      <div className="opaque"></div>
      <div>
        <button className="close" onClick={handleClose}>
          x
        </button>
        <fetcher.Form method="POST" action="/api/upload">
          <input type="file" name="file" accept="image/*" />
          <br />
          <button type="submit">submit</button>
        </fetcher.Form>
        or
        <form onSubmit={handleSubmit}>
          <input
            type="url"
            placeholder="Enter image URL here"
            value={src}
            onChange={(e) => setSrc(e.target.value)}
          />
          <br />
          <button type="submit">submit</button>
        </form>
      </div>
    </dialog>
  );
};
