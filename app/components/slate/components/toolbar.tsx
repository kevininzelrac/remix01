import BlockButton from "./blocks";
import { ToggleLink } from "./links";
import MarkButton from "./marks";
import TextAlign from "./textAlign";
import AddVoid from "./voids";
import { UndoButton, RedoButton } from "./history";
import { Dispatch, SetStateAction } from "react";

export default function Toolbar({
  isDraft,
  setIsDraft,
  handleSave,
}: {
  isDraft: boolean;
  setIsDraft: Dispatch<SetStateAction<boolean>>;
  handleSave: () => boolean;
}) {
  return (
    <nav className="toolbar">
      <UndoButton />
      <RedoButton />

      <MarkButton type="bold" />
      <MarkButton type="italic" />
      <MarkButton type="underline" />
      <MarkButton type="code" />

      <BlockButton type="h2" />
      <BlockButton type="h3" />
      <BlockButton type="h4" />

      <BlockButton type="paragraph" />
      <BlockButton type="blockquote" />
      <BlockButton type="ol" />
      <BlockButton type="ul" />

      <TextAlign textAlign="left" />
      <TextAlign textAlign="center" />
      <TextAlign textAlign="right" />
      <TextAlign textAlign="justify" />

      <ToggleLink />
      <AddVoid type="image" />
      <AddVoid type="youtube" />
      <button
        onClick={() => {
          handleSave() ? setIsDraft(false) : null;
        }}
        style={{
          color: isDraft ? "red" : "black",
          fontWeight: isDraft ? "bold" : "normal",
          opacity: isDraft ? "1" : "0.4",
        }}
        disabled={!isDraft}
      >
        save
      </button>
    </nav>
  );
}
