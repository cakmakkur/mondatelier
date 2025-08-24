import { useRef, useState } from "react";
// @ts-expect-error auth context
import useAxiosPrivate from "../../auth/useAxiosPrivate";
import { useModalContext } from "../../context/ModalContext";
import { useProfileContext } from "../../context/ProfileContext";
export default function ImageLoader({ targetUrl }: { targetUrl: string }) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const axiosPrivate = useAxiosPrivate();
  const { setComponentState } = useModalContext();
  const { setProfile } = useProfileContext();

  const uploadImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("uploading");
    const formData = new FormData();

    if (imageFile) {
      formData.append("image", imageFile);
    }

    const headers = {
      "Content-Type": "multipart/form-data",
      "Content-Disposition": 'form-data; name="image"; filename="event.json"',
    };

    try {
      const response = await axiosPrivate.put(targetUrl, formData, {
        headers,
      });
      if (response.status === 200) {
        // return success
        overlayRef.current!.style.opacity = "1";
        setTimeout(() => {
          setComponentState(undefined);
        }, 1700);
        // updating profile everytime an images is uploaded might be a problem
        setProfile(response.data);
      } else {
        // handle error
      }
    } catch (error) {
      console.error(error);
      // handle error
    }
  };

  return (
    <div className="image_popup_wrapper">
      <div ref={overlayRef} className="image_popup_wrapper__overlay">
        <img
          src="/check_68dp_314D1C_FILL0_wght400_GRAD0_opsz48.svg"
          alt="check symbol"
        />
        <span>Image uploaded</span>
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
            Upload Image
          </button>
        </div>
      </form>
    </div>
  );
}
