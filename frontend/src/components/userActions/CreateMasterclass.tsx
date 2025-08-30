import { useEffect, useRef, useState } from "react";
import { useProfileContext } from "../../context/ProfileContext";

// @ts-expect-error auth context
import useAxiosPrivate from "../../auth/useAxiosPrivate";
import BgFx2 from "../fx/BgFx2";
import { useModalContext } from "../../context/ModalContext";
import ToolTip from "../../util/Tooltip";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

const CATEGORIES_PATH = import.meta.env.VITE_ART_CATEGORIES_PATH;
const MASTERCLASS_PATH = import.meta.env.VITE_MASTERCLASS_PATH;
const CITIES_PATH = import.meta.env.VITE_CITIES_PATH;

export default function CreateMasterclass() {
  const { profile } = useProfileContext();
  const axiosPrivate = useAxiosPrivate();
  const { setComponentState } = useModalContext();
  const overlayRef = useRef<HTMLDivElement>(null);
  const countries = useSelector((state: RootState) => state.location.countries);

  const [cities, setCities] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("Austria");
  const [artCategories, setArtCategories] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formValues, setFormValues] = useState({
    title: "",
    city: "",
    description: "",
    sessions: 1,
    sessionDuration: 0,
    sessionPrice: 0,
    artCategory: "",
    profileId: "",
    type: 1,
  });
  const emptyErrorMessages = {
    title: "",
    description: "",
    sessions: "",
    sessionDuration: "",
    sessionPrice: "",
    artCategory: "",
    profileId: "",
    type: "",
  };
  const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>(
    emptyErrorMessages
  );

  const validateForm = () => {
    let newErrorMessages = errorMessages;
    let errorOccured = false;
    if (formValues.title === "") {
      newErrorMessages = { ...newErrorMessages, title: "Give a title" };
      errorOccured = true;
    }
    if (formValues.title.length > 1024) {
      newErrorMessages = { ...newErrorMessages, title: "Too long" };
      errorOccured = true;
    }
    if (formValues.artCategory === "") {
      newErrorMessages = {
        ...newErrorMessages,
        artCategoriy: "Select a category",
      };
      errorOccured = true;
    }
    if (formValues.description === "") {
      newErrorMessages = { ...newErrorMessages, title: "Give a description" };
      errorOccured = true;
    }
    if (formValues.description.length > 1024) {
      newErrorMessages = { ...newErrorMessages, description: "Too long" };
      errorOccured = true;
    }
    if (formValues.sessions === 0) {
      newErrorMessages = { ...newErrorMessages, sessions: "Cannot be 0" };
      errorOccured = true;
    }
    if (formValues.sessionPrice === 0) {
      newErrorMessages = { ...newErrorMessages, sessionPrice: "Cannot be 0" };
      errorOccured = true;
    }
    setErrorMessages(newErrorMessages);
    setTimeout(() => {
      setErrorMessages(emptyErrorMessages);
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
        `${MASTERCLASS_PATH}`,
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
      const response = await fetch(`${CATEGORIES_PATH}/all`);
      setArtCategories(await response.json());
    } catch (error) {
      console.error("Error fetching art categories:", error);
    }
  };

  const getCitiesByCountry = async (country: string) => {
    try {
      const response = await fetch(`${CITIES_PATH}/by_country/${country}`);
      const data = await response.json();
      setCities(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const initiateEventForm = async () => {
      if (!profile) return;
      setSelectedCountry(profile.country);
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

  useEffect(() => {
    const getCities = async () => {
      const cities = await getCitiesByCountry(selectedCountry);
      if (!cities) return;
      setFormValues((prev) => {
        return {
          ...prev,
          city: cities[0] || "",
        };
      });
      setCities(cities);
    };
    getCities();
  }, [selectedCountry]);

  return (
    <div className="create_popup_wrapper">
      <div ref={overlayRef} className="create_popup_wrapper__overlay">
        <img
          src="/check_68dp_314D1C_FILL0_wght400_GRAD0_opsz48.svg"
          alt="check symbol"
        />
        <span>Masterclass added</span>
      </div>
      <BgFx2 />
      <form className="popup_form" onSubmit={(e) => postMasterclass(e)}>
        <h1 style={{ color: "white" }}>Create new masterclass</h1>
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
              {errorMessages.category !== "" ? (
                <ToolTip
                  text={errorMessages.category}
                  tooltipPosition={"bottom"}
                />
              ) : (
                ""
              )}
            </label>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", rowGap: "10px" }}
          >
            <label className="popup_form__title">
              <input
                className="popup_form__input"
                type="text"
                name="title"
                value={formValues.title}
                onChange={handleChange}
                placeholder="Masterclass title"
              />
              {errorMessages.title !== "" ? (
                <ToolTip
                  text={errorMessages.title}
                  tooltipPosition={"bottom"}
                />
              ) : (
                ""
              )}
            </label>

            <label className="popup_form__description">
              <textarea
                className="popup_form__textarea"
                name="description"
                value={formValues.description}
                onChange={handleChange}
                placeholder="Describe your masterclass"
              />
              {errorMessages.description !== "" ? (
                <ToolTip
                  text={errorMessages.description}
                  tooltipPosition={"bottom"}
                />
              ) : (
                ""
              )}
            </label>

            <label htmlFor="isDigital" className="popup_form__digital">
              <input
                type="checkbox"
                id="type"
                name="type"
                checked={formValues.type === 1}
                onChange={() => {
                  if (formValues.type === 1) {
                    setFormValues((prev) => ({ ...prev, type: 2 }));
                  } else {
                    setFormValues((prev) => ({ ...prev, type: 1 }));
                  }
                }}
              />
              <span className="popup_form__is_digital_text">
                Online Masterclass?
              </span>
              {errorMessages.type !== "" ? (
                <ToolTip text={errorMessages.type} tooltipPosition={"bottom"} />
              ) : (
                ""
              )}
            </label>

            <div style={{ color: "white" }}>Location:</div>
            <div className="popup_form__location">
              <label className="popup_form__country">
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="popup_form__dropdown"
                  required
                  disabled={formValues.type === 1}
                  style={formValues.type === 1 ? { color: "gray" } : {}} // if event is digital, color is gray
                >
                  <option value="">Select country</option>
                  {countries.map((country, i) => (
                    <option key={country + i} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </label>

              <label className="popup_form__city">
                <select
                  value={formValues.city}
                  onChange={(e) =>
                    setFormValues((prev) => ({ ...prev, city: e.target.value }))
                  }
                  disabled={!selectedCountry || formValues.type === 1}
                  style={formValues.type === 1 ? { color: "gray" } : {}} // if event is digital, color is gray
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
              </label>
            </div>

            <div style={{ color: "white" }}>Sessions: </div>
            <div className="popup_form__session">
              <label className="popup_form__sessions">
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
                {errorMessages.sessions !== "" ? (
                  <ToolTip
                    text={errorMessages.sessions}
                    tooltipPosition={"bottom"}
                  />
                ) : (
                  ""
                )}
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
                {errorMessages.sessionDuration !== "" ? (
                  <ToolTip
                    text={errorMessages.sessionDuration}
                    tooltipPosition={"bottom"}
                  />
                ) : (
                  ""
                )}
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
                {errorMessages.sessionPrice !== "" ? (
                  <ToolTip
                    text={errorMessages.sessionPrice}
                    tooltipPosition={"bottom"}
                  />
                ) : (
                  ""
                )}
              </label>
            </div>
            <span className="popup_form__sessions_text">
              Duration and Price for single session
            </span>

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
    </div>
  );
}
