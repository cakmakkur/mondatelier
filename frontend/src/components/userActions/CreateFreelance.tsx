import { useEffect, useRef, useState } from "react";
import { useProfileContext } from "../../context/ProfileContext";

// @ts-expect-error auth context
import useAxiosPrivate from "../../auth/useAxiosPrivate";
import BgFx2 from "../fx/BgFx2";
import { useModalContext } from "../../context/ModalContext";

const CATEGORIES_PATH = import.meta.env.VITE_ART_CATEGORIES_PATH;
const FREELANCE_PATH = import.meta.env.VITE_MASTERCLASS_PATH;
const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function CreateFreelance() {
  const { profile } = useProfileContext();
  const axiosPrivate = useAxiosPrivate();
  const { setComponentState } = useModalContext();
  const overlayRef = useRef<HTMLDivElement>(null);
  const confirmationRef = useRef<HTMLDivElement>(null);
  const [selectedCountry, setSelectedCountry] = useState("Austria");
  const [artCategories, setArtCategories] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
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

  const postMasterclass = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    const eventBlob = new Blob([JSON.stringify(formValues)], {
      type: "application/json",
    });

    formData.append("masterclass", eventBlob);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const headers = {
      "Content-Type": "multipart/form-data",
      "Content-Disposition":
        'form-data; name="masterclass"; filename="event.json"',
    };

    try {
      const response = await axiosPrivate.post(
        `${BASE_URL}/${MASTERCLASS_PATH}`,
        formData,
        { headers }
      );
      if (response.status === 200) {
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
      const response = await fetch(`${BASE_URL}/${CATEGORIES_PATH}/all`);
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
      <form className="popup_form" onSubmit={(e) => postMasterclass(e)}>
        <h1 style={{ color: "white" }}>Start Freelancing</h1>
        <div
          style={{ display: "flex", flexDirection: "row", columnGap: "30px" }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label className="popup_form__image">
              <div className="popup_form__image_overlay">
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
            {/* <label className="popup_form__title">
              <input
                className="popup_form__input"
                type="text"
                name="title"
                value={formValues.title}
                onChange={handleChange}
                placeholder="Masterclass title"
              />
            </label> */}

            <label className="popup_form__description">
              <textarea
                className="popup_form__textarea"
                name="description"
                value={formValues.description}
                onChange={handleChange}
                placeholder="Masterclass description"
              />
            </label>

            <div style={{ color: "white" }}>Sessions: </div>
            <div className="popup_form__session">
              {/* <label className="popup_form__sessions">
                <input
                  type="number"
                  name="sessions"
                  min={0}
                  max={25}
                  placeholder="Sessions"
                  value={formValues.sessions}
                  onChange={handleChange}
                  className="popup_form__number"
                  required
                ></input>
              </label>
              <label className="popup_form__sessions">
                <input
                  type="number"
                  placeholder="Duration"
                  name="sessionDuration"
                  min={0}
                  max={25}
                  value={formValues.sessionDuration}
                  onChange={handleChange}
                  className="popup_form__number"
                  required
                ></input>
              </label>
              <label className="popup_form__sessions">
                <input
                  type="number"
                  name="sessionPrice"
                  placeholder="Price"
                  min={0}
                  max={25}
                  value={formValues.sessionPrice}
                  onChange={handleChange}
                  className="popup_form__number"
                  required
                ></input>
              </label> */}
            </div>
            <span className="popup_form__sessions_text">
              Duration and Price for single session
            </span>

            <div style={{ color: "white" }}>Location:</div>
            <div className="popup_form__location">
              <label className="popup_form__country">
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="popup_form__dropdown"
                  required
                >
                  <option value="">Select country</option>
                  {countries.map((country, i) => (
                    <option key={country + i} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </label>

              {/* <label className="popup_form__city">
                <select
                  value={formValues.city}
                  onChange={(e) =>
                    setFormValues((prev) => ({ ...prev, city: e.target.value }))
                  }
                  disabled={!selectedCountry}
                  required
                  className="popup_form__dropdown"
                >
                  <option value="">Select city</option>
                  {cities.map((city, i) => (
                    <option key={city + i} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </label> */}
            </div>

            <button
              style={{ width: "240px" }}
              type="submit"
              className="popup_form__submit"
            >
              Create Masterclass
            </button>
          </div>
        </div>
      </form>
      {/* confirmation animation*/}
      <div ref={confirmationRef} className="auth_success">
        <img src="/check_60dp_48752C_FILL0_wght400_GRAD0_opsz48.svg" alt="" />
      </div>
    </div>
  );
}
