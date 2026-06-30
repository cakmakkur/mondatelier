import { useEffect, useRef, useState } from "react";
import { useProfileContext } from "../../context/ProfileContext";
import useAxiosPrivate from "../../auth/useAxiosPrivate";
import BgFx2 from "../fx/BgFx2";
import { useModalContext } from "../../context/ModalContext";

const CATEGORIES_PATH = import.meta.env.VITE_ART_CATEGORIES_PATH;
const FREELANCE_PATH = import.meta.env.VITE_FREELANCE_PATH;

export default function CreateFreelance() {
  const { profile } = useProfileContext();
  const axiosPrivate = useAxiosPrivate();
  const { setComponentState } = useModalContext();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [artCategories, setArtCategories] = useState<string[]>([]);
  const [formValues, setFormValues] = useState({
    profileId: "",
    artCategory: "",
    description: "",
  });
  const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>(
    {
      artCategory: "",
      description: "",
    }
  );

  const validateForm = () => {
    let newErrorMessages = errorMessages;
    let errorOccured = false;
    if (formValues.artCategory === "") {
      newErrorMessages = {
        ...newErrorMessages,
        artCategory: "Select a category",
      };
      errorOccured = true;
    }
    if (formValues.description === "") {
      newErrorMessages = {
        ...newErrorMessages,
        description: "Give a description",
      };
      errorOccured = true;
    }
    if (formValues.description.length > 1024) {
      newErrorMessages = { ...newErrorMessages, description: "Too long" };
      errorOccured = true;
    }
    setErrorMessages(newErrorMessages);
    setTimeout(() => {
      setErrorMessages({
        description: "",
        artCategory: "",
      });
    }, 2500);
    return !errorOccured;
  };

  const postFreelance = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axiosPrivate.post(FREELANCE_PATH, formValues);
      if (response.status === 201) {
        // return success
        overlayRef.current!.style.opacity = "1";
        setTimeout(() => {
          setComponentState(undefined);
        }, 1700);
        return response.data;
      } else {
        // handle error
      }
    } catch (error) {
      console.error(error);
      // handle error
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const fetchArtCategories = async () => {
    try {
      const response = await fetch(`${CATEGORIES_PATH}/all`);
      setArtCategories(await response.json());
    } catch (error) {
      console.error("Error fetching art categories:", error);
    }
  };

  useEffect(() => {
    const initiateEventForm = async () => {
      if (!profile) return;
      await fetchArtCategories();
      setFormValues((prev) => {
        return {
          ...prev,
          profileId: profile.id,
        };
      });
    };
    initiateEventForm();
  }, [profile]);

  return (
    <div className="create_popup_wrapper">
      <div ref={overlayRef} className="create_popup_wrapper__overlay">
        <img
          src="/check_68dp_314D1C_FILL0_wght400_GRAD0_opsz48.svg"
          alt="check symbol"
        />
        <span>Successful. Good luck!</span>
      </div>
      <BgFx2 />
      <form className="popup_form" onSubmit={(e) => postFreelance(e)}>
        <h1 style={{ color: "white" }}>Start Freelancing</h1>
        <div
          style={{ display: "flex", flexDirection: "row", columnGap: "30px" }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ color: "white", margin: "30px 0px 10px" }}>
              Category:
            </div>
            <label className="popup_form__art_category">
              <select
                value={formValues.artCategory}
                onChange={(e) =>
                  setFormValues({ ...formValues, artCategory: e.target.value })
                }
                className="popup_form__dropdown"
                style={{ width: "200px" }}
                required
              >
                <option value="">Select category</option>
                {artCategories.map((category, i) => (
                  <option key={category + i} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", rowGap: "10px" }}
          >
            <label className="popup_form__description">
              <textarea
                className="popup_form__textarea"
                name="description"
                value={formValues.description}
                onChange={handleChange}
                placeholder="Masterclass description"
              />
            </label>

            <button
              style={{ width: "240px" }}
              type="submit"
              className="popup_form__submit"
            >
              Start Freelancing
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
