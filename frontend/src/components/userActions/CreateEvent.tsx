import { useEffect, useRef, useState } from "react";
import { useProfileContext } from "../../context/ProfileContext";
import { useModalContext } from "../../context/ModalContext";

// @ts-expect-error auth context
import useAxiosPrivate from "../../auth/useAxiosPrivate";
import BgFx2 from "../fx/BgFx2";
import ToolTip from "../fx/Tooltip";

const EVENTS_PATH = import.meta.env.VITE_EVENTS_PATH;
const COUNTRIES_PATH = import.meta.env.VITE_COUNTRIES_PATH;
const CITIES_PATH = import.meta.env.VITE_CITIES_PATH;
const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function CreateEvent() {
  const { profile } = useProfileContext();
  const axiosPrivate = useAxiosPrivate();
  const { setComponentState } = useModalContext();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>(
    {
      title: "",
      description: "",
      date: "",
    }
  );
  const [countries, setCountries] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("Austria");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formValues, setFormValues] = useState({
    id: "",
    title: "",
    type: 2,
    city: "",
    description: "",
    date: "",
    profileId: "",
    thumbnail_url: "",
  });

  const validateForm = () => {
    let newErrorMessages = errorMessages;
    let errorOccured = false;
    if (formValues.title.length > 128) {
      newErrorMessages = { ...newErrorMessages, title: "Too long" };
      errorOccured = true;
    }
    if (formValues.title === "") {
      newErrorMessages = { ...newErrorMessages, title: "Give a title" };
      errorOccured = true;
    }
    if (formValues.description.length > 1024) {
      newErrorMessages = { ...newErrorMessages, description: "Too long" };
      errorOccured = true;
    }
    if (formValues.description === "") {
      newErrorMessages = {
        ...newErrorMessages,
        description: "Give a description",
      };
      errorOccured = true;
    }
    if (formValues.date === "") {
      newErrorMessages = { ...newErrorMessages, date: "Select a date" };
      errorOccured = true;
    }
    setErrorMessages(newErrorMessages);
    setTimeout(() => {
      setErrorMessages({
        title: "",
        description: "",
        date: "",
      });
    }, 2500);
    return !errorOccured;
  };

  const postEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    const eventBlob = new Blob([JSON.stringify(formValues)], {
      type: "application/json",
    });

    formData.append("event", eventBlob);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const headers = {
      "Content-Type": "multipart/form-data",
      "Content-Disposition": 'form-data; name="event"; filename="event.json"',
    };

    try {
      const response = await axiosPrivate.post(
        `${BASE_URL}/${EVENTS_PATH}/create`,
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

  const fetchCountries = async () => {
    try {
      const response = await fetch(`${BASE_URL}/${COUNTRIES_PATH}`);
      setCountries(await response.json());
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };
  const getCitiesByCountry = async (country: string) => {
    try {
      const response = await fetch(
        `${BASE_URL}/${CITIES_PATH}/by_country/${country}`
      );
      const data = await response.json();
      setCities(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const initiateEventForm = async () => {
      await fetchCountries();
      if (!profile) return;
      setSelectedCountry(profile.country);
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
        <span>Event posted successfully</span>
      </div>
      <BgFx2 />
      <form className="popup_form" onSubmit={(e) => postEvent(e)}>
        <h1 style={{ color: "white" }}>Create new event</h1>
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
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", rowGap: "10px" }}
          >
            <label className="popup_form__title popup_form__label">
              <input
                className="popup_form__input"
                type="text"
                name="title"
                value={formValues.title}
                onChange={handleChange}
                placeholder="Event title"
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

            <label className="popup_form__description popup_form__label">
              <textarea
                className="popup_form__textarea"
                name="description"
                value={formValues.description}
                onChange={handleChange}
                placeholder="Event description"
              />
              {errorMessages.description !== "" ? (
                <ToolTip
                  text={errorMessages.description}
                  tooltipPosition={"bottom"}
                />
              ) : null}
            </label>
            <div style={{ color: "white" }}>Date:</div>

            <label className="popup_form__date popup_form__label">
              <input
                className="popup_form__date_input"
                type="date"
                name="date"
                value={formValues.date}
                onChange={handleChange}
              />
              {errorMessages.date !== "" ? (
                <ToolTip text={errorMessages.date} tooltipPosition={"bottom"} />
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
              </label>
            </div>
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
                Is this event digital?
              </span>
            </label>
            <button type="submit" className="popup_form__submit">
              Create Event
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
