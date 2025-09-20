import ToolTip from "../../util/Tooltip";

interface CreateNewPostProps {
  type: "main" | "comment";
}

export default function CreateNewPost({ type }: CreateNewPostProps) {
  function autoGrow(element: HTMLTextAreaElement) {
    element.style.height = "5px";
    element.style.height = element.scrollHeight + "px";
  }

  return (
    <div className="fullpost-create-comment">
      <div className="fullpost-create-placeholder">
        <img src="/edit-lightgray.svg" alt="add a comment icon" />
      </div>
      <textarea
        onInput={(e) => autoGrow(e.target as HTMLTextAreaElement)}
        placeholder={type === "main" ? "What's on your mind?" : "Add a comment"}
        className="fullpost-add-comment-input"
      />
      <div className="fullpost-create-camara">
        <img src="/camara.svg" alt="add multimedia icon" />
        <ToolTip text="Add multimedia" tooltipPosition="bottom" />
      </div>
      <div className="fullpost-create-send">
        <img src="/send.svg" alt="send post icon" />
      </div>
    </div>
  );
}
