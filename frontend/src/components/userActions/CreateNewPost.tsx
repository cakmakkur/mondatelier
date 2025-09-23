import { useEffect, useRef, useState } from "react";
import ToolTip from "../../util/Tooltip";
import { useAuthContext } from "../../auth/AuthContext";
import { useModalContext } from "../../context/ModalContext";
import Login from "../auth/Login";
import useAxiosPrivate from "../../auth/useAxiosPrivate";

interface CreateNewPostProps {
  parentPostId?: number | undefined;
  communityId: number;
}

const POST_PATH = import.meta.env.VITE_POST_PATH;
const MAX_FILE_SIZE_MB = 500; // MB
const MAX_FILE_AMOUNT = 5;

export default function CreateNewPost({
  parentPostId,
  communityId,
}: CreateNewPostProps) {
  const { auth } = useAuthContext();
  const axiosPrivate = useAxiosPrivate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setComponentState } = useModalContext();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const checkAuth = (e: React.MouseEvent) => {
    if (!auth) {
      e.stopPropagation();
      setComponentState(Login);
      return;
    }
  };

  const handleSend = async () => {
    if (!title || !content) return;

    try {
      const formData = new FormData();

      const postCreationDto = {
        title,
        content,
        profileId: auth?.profileId,
        communityId,
        parentPostId,
      };
      formData.append(
        "post",
        new Blob([JSON.stringify(postCreationDto)], {
          type: "application/json",
        })
      );

      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      await axiosPrivate.post(POST_PATH + "/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // TODO: handle success
      setContent("");
      setSelectedFiles([]);
    } catch (error) {
      console.error("Error sending post:", error);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (e.target.value === "") setTitle("");
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (file: File) => {
    setSelectedFiles((prev) => prev.filter((f) => f !== file));
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (selectedFiles.length === MAX_FILE_AMOUNT) {
      // TODO: handle error meldung to the user
      alert("max 5 files");
    }

    const validFiles: File[] = [];

    for (const file of Array.from(files)) {
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB <= MAX_FILE_SIZE_MB) {
        validFiles.push(file);
      } else {
        // TODO: handle error meldung
      }
    }

    setSelectedFiles((prev) => [...prev, ...validFiles].slice(0, 5));
    e.target.value = "";
  };

  // textarea autogrow function
  function autoGrow(element: HTMLTextAreaElement) {
    element.style.height = "5px";
    element.style.height = element.scrollHeight + "px";
  }

  useEffect(() => {
    console.log(selectedFiles);
  }, [selectedFiles]);

  return (
    <div
      onClick={(e) => checkAuth(e)}
      style={
        content === "" ? {} : { backgroundColor: "rgba(148, 154, 133, 0.174)" }
      }
      className="fullpost-create-comment"
    >
      {content !== "" && !parentPostId ? (
        <div className="fullpost-create-comment-title-div">
          <div className="fullpost-create-placeholder">
            <img src="/edit-lightgray.svg" alt="add a comment icon" />
          </div>
          <input
            placeholder="Title"
            type="text"
            max={60}
            value={title}
            onChange={(e) => handleTitleChange(e)}
          />
        </div>
      ) : (
        ""
      )}
      <div className="fullpost-create-comment-message-div">
        <div className="fullpost-create-placeholder">
          <img src="/edit-lightgray.svg" alt="add a comment icon" />
        </div>
        <textarea
          value={content}
          onInput={(e) => autoGrow(e.target as HTMLTextAreaElement)}
          onChange={(e) => handleMessageChange(e)}
          placeholder={!parentPostId ? "What's on your mind?" : "Add a comment"}
          className="fullpost-add-comment-input"
        />
        <div className="fullpost-create-camara" onClick={handleFileClick}>
          <img src="/camara.svg" alt="add multimedia icon" />
          <ToolTip text="Add multimedia" tooltipPosition="bottom" />
        </div>
        <div onClick={handleSend} className="fullpost-create-send">
          <img src="/send.svg" alt="send post icon" />
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        multiple
        accept="image/*,video/*,audio/*"
        onChange={handleFilesSelected}
      />

      <div className="uploaded-flex">
        {selectedFiles.map((file, idx) => {
          if (file.type.startsWith("image/")) {
            return (
              <div
                onClick={() => {
                  handleRemoveFile(file);
                }}
                className="post-upload-item-overlay"
              >
                <div className="post-upload-item-remove-overlay">
                  <img
                    className="post-upload-item-remove"
                    src="/delete2.svg"
                    alt="Discard uploaded file button icon"
                  />
                </div>
                <img
                  key={idx}
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="post-upload-item"
                />
              </div>
            );
          } else if (file.type.startsWith("video/")) {
            return (
              <div
                onClick={() => {
                  handleRemoveFile(file);
                }}
                className="post-upload-item-overlay"
              >
                <div className="post-upload-item-remove-overlay">
                  <img
                    className="post-upload-item-remove"
                    src="/delete2.svg"
                    alt="Discard uploaded file button icon"
                  />
                </div>

                <video
                  key={idx}
                  src={URL.createObjectURL(file)}
                  controls={false}
                  muted
                  className="post-upload-item"
                />
              </div>
            );
          } else if (file.type.startsWith("audio/")) {
            return (
              <div className="post-upload-item-overlay">
                <div
                  onClick={() => {
                    handleRemoveFile(file);
                  }}
                  className="post-upload-item-remove-overlay"
                >
                  <img
                    className="post-upload-item-remove"
                    src="/delete2.svg"
                    alt="Discard uploaded file button icon"
                  />
                </div>
                <audio
                  key={idx}
                  src={URL.createObjectURL(file)}
                  controls
                  className="post-upload-item"
                />
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
