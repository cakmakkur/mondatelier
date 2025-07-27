import { useEffect, useRef, useState } from "react";
import { useProfileContext } from "../../context/ProfileContext";

// @ts-expect-error auth context
import useAxiosPrivate from "../../auth/useAxiosPrivate";
import BgFx2 from "../fx/BgFx2";

const EVENTS_PATH = import.meta.env.VITE_EVENTS_PATH;
const COUNTRIES_PATH = import.meta.env.VITE_COUNTRIES_PATH;
const CITIES_PATH = import.meta.env.VITE_CITIES_PATH;
const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function CreateEvent() {
  const { profile } = useProfileContext();
  const axiosPrivate = useAxiosPrivate();

  const confirmationRef = useRef<HTMLDivElement>(null);
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

  const postEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
            <label className="popup_form__title">
              <input
                className="popup_form__input"
                type="text"
                name="title"
                value={formValues.title}
                onChange={handleChange}
                placeholder="Event title"
              />
            </label>

            <label className="popup_form__description">
              <textarea
                className="popup_form__textarea"
                name="description"
                value={formValues.description}
                onChange={handleChange}
                placeholder="Event description"
              />
            </label>
            <div style={{ color: "white" }}>Date:</div>

            <label className="popup_form__date">
              <input
                className="popup_form__date_input"
                type="date"
                name="date"
                value={formValues.date}
                onChange={handleChange}
              />
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
      {/* confirmation animation*/}
      <div ref={confirmationRef} className="auth_success">
        <img src="/check_60dp_48752C_FILL0_wght400_GRAD0_opsz48.svg" alt="" />
      </div>
    </div>
  );
}
