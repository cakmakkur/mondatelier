import ToolTip from "../../util/Tooltip";

export default function CreateNewComment() {
  return (
    <div className="fullpost-create-comment">
      <div className="fullpost-create-placeholder">
        <img src="/edit-lightgray.svg" alt="add a comment icon" />
      </div>
      <input
        type="text"
        placeholder="Join the conversation..."
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
