import { useRef, useState } from "react";
// @ts-expect-error auth context
import useAxiosPrivate from "../../auth/useAxiosPrivate";
import { useModalContext } from "../../context/ModalContext";
import { useProfileContext } from "../../context/ProfileContext";

interface Response {
  status: string;

  message: string;
}
export default function ImageUploader({ targetUrl }: { targetUrl: string }) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const axiosPrivate = useAxiosPrivate();
  const { setComponentState } = useModalContext();
  const { setProfile } = useProfileContext();
  const [response, setResponse] = useState<Response | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const uploadImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();

    if (imageFile) {
      formData.append("image", imageFile);
    }

    const headers = {
      "Content-Type": "multipart/form-data",
      "Content-Disposition": 'form-data; name="image"; filename="event.json"',
    };

    try {
      const res = await axiosPrivate.put(targetUrl, formData, {
        headers,
      });
      setIsLoading(false);
      overlayRef.current?.classList.add(
        "image_popup_wrapper__response_overlay--open"
      );
      if (res.status === 200) {
        overlayRef.current?.classList.add(
          "image_popup_wrapper__response_overlay--open"
        );
        setResponse({
          status: "success",
          message: "Image uploaded successfully",
        });
        setProfile(res.data);
        setTimeout(() => {
          setComponentState(undefined);
          overlayRef.current?.classList.remove(
            "image_popup_wrapper__response_overlay--open"
          );
        }, 1700);
      } else {
        overlayRef.current?.classList.add(
          "image_popup_wrapper__response_overlay--open"
        );
        setResponse({
          status: "error",
          message: "Upload failed, please try again",
        });
      }
    } catch (error) {
      console.warn(error);
      overlayRef.current?.classList.add(
        "image_popup_wrapper__response_overlay--open"
      );
      setResponse({
        status: "error",
        message: "Upload failed, please try later",
      });
    }
  };

  return (
    <div className="image_popup_wrapper">
      <div
        ref={overlayRef}
        className="image_popup_wrapper__response_overlay image_popup_wrapper__response_overlay--success"
      >
        {response?.status === "success" ? (
          <>
            <img
              src="/check_68dp_314D1C_FILL0_wght400_GRAD0_opsz48.svg"
              alt="check symbol"
            />
            <span>{response.message}</span>
          </>
        ) : response?.status === "error" ? (
          <>
            ´<span className="image_popup_wrapper__response_overlay__x">X</span>
            <span className="image_popup_wrapper__response_overlay__message">
              {response.message}
            </span>
            <button
              onClick={(e) => {
                console.log("hi");
                e.stopPropagation();
                overlayRef.current!.style.opacity = "0";
                overlayRef.current?.classList.remove(
                  "image_popup_wrapper__response_overlay--open"
                );
                setResponse(null);
              }}
              className="image_popup_wrapper__response_overlay__try_again"
            >
              Try Again
            </button>
          </>
        ) : null}
      </div>

      <form className="image_popup_form" onSubmit={(e) => uploadImage(e)}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label className="image_form__image">
            <div className="image_form__image_overlay">
              {imageFile && <img src={URL.createObjectURL(imageFile)} />}
            </div>
            <input
              className="popup_form__image_input"
              type="file"
              name="image"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setImageFile(e.target.files[0]);
                }
              }}
            />
            <img
              style={{ padding: "100px" }}
              src="/photo_camera_140dp_F3F3F3_FILL0_wght400_GRAD0_opsz48.svg"
              alt=""
            />
          </label>
        </div>
        <div
          style={{ display: "flex", flexDirection: "column", rowGap: "10px" }}
        >
          <button
            style={{ width: "240px" }}
            type="submit"
            className="image_popup_form__save"
            disabled={!imageFile}
          >
            {isLoading ? "Uploading..." : "Upload Image"}
          </button>
        </div>
      </form>
    </div>
  );
}
