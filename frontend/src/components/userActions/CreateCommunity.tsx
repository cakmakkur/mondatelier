import { useRef, useState } from "react";
import BgFx2 from "../fx/BgFx2";
import useObjectUrl from "../../util/useObjectUrl";
import useAxiosPrivate from "../../auth/useAxiosPrivate";
import ToolTip from "../../util/Tooltip";
import { useModalContext } from "../../context/ModalContext";

const COMMUNITIES_PATH = import.meta.env.VITE_COMMUNITIES_PATH;

export default function Community() {
  const axiosPrivate = useAxiosPrivate();

  const overlayRef = useRef<HTMLDivElement>(null);
  const { setComponentState } = useModalContext();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const imagePreviewUrl = useObjectUrl(imageFile);
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
  });

  const emptyErrorMessages = {
    name: "",
    description: "",
  };

  const validateForm = () => {
    let newErrorMessages = errorMessages;
    let errorOccured = false;
    if (formValues.name.length > 128) {
      newErrorMessages = { ...newErrorMessages, title: "Name is too long" };
      errorOccured = true;
    }
    if (formValues.name === "") {
      newErrorMessages = {
        ...newErrorMessages,
        title: "A community needs a name",
      };
      errorOccured = true;
    }
    if (formValues.description.length > 1024) {
      newErrorMessages = { ...newErrorMessages, description: "Too long" };
      errorOccured = true;
    }
    if (formValues.description === "") {
      newErrorMessages = {
        ...newErrorMessages,
        description: "Describe your community",
      };
      errorOccured = true;
    }
    setErrorMessages(newErrorMessages);
    setTimeout(() => {
      setErrorMessages(emptyErrorMessages);
    }, 2500);
    return !errorOccured;
  };

  const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>(
    emptyErrorMessages
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const postCommunity = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    const communityBlob = new Blob([JSON.stringify(formValues)], {
      type: "application/json",
    });

    formData.append("community", communityBlob);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const headers = {
      "Content-Type": "multipart/form-data",
      "Content-Disposition":
        'form-data; name="community"; filename="community.json"',
    };

    try {
      const response = await axiosPrivate.post(
        `${COMMUNITIES_PATH}/create`,
        formData,
        {
          headers,
        }
      );
      overlayRef.current!.style.opacity = "1";
      setTimeout(() => {
        setComponentState(undefined);
      }, 1700);
      return response.data;
    } catch (error) {
      console.error(error);
      // handle error
    }
  };

  return (
    <div className="create_popup_wrapper">
      <div ref={overlayRef} className="create_popup_wrapper__overlay">
        <img
          src="/check_68dp_314D1C_FILL0_wght400_GRAD0_opsz48.svg"
          alt="check symbol"
        />
        <span>New community created successfully</span>
      </div>
      <BgFx2 />
      <form
        className="popup_form_community_add"
        onSubmit={(e) => postCommunity(e)}
      >
        <h1 style={{ color: "white" }}>Create new community</h1>
        <div
          style={{ display: "flex", flexDirection: "row", columnGap: "30px" }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label className="popup_form__image">
              <div className="popup_form__image_overlay">
                {imagePreviewUrl && <img src={imagePreviewUrl} alt="" />}
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
            <label className="popup_form__title popup_form__label">
              <input
                className="popup_form__input"
                type="text"
                name="name"
                value={formValues.name}
                onChange={handleChange}
                placeholder="Community name"
              />
              {errorMessages.title !== "" ? (
                <ToolTip text={errorMessages.name} tooltipPosition={"bottom"} />
              ) : (
                ""
              )}
            </label>

            <label className="popup_form__description popup_form__label">
              <textarea
                className="popup_form__textarea"
                name="description"
                value={formValues.description}
                onChange={handleChange}
                placeholder="Describe your community"
              />
              {errorMessages.description !== "" ? (
                <ToolTip
                  text={errorMessages.description}
                  tooltipPosition={"bottom"}
                />
              ) : null}
            </label>
            <button type="submit" className="popup_form__submit">
              Create
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
