import { useEffect, useState } from "react";
import { useProfileContext } from "../../context/ProfileContext";

// @ts-expect-error auth context
import useAxiosPrivate from "../../auth/useAxiosPrivate";
// import BgFx2 from "../fx/BgFx2";

const EVENTS_PATH = import.meta.env.VITE_EVENTS_PATH;
const COUNTRIES_PATH = import.meta.env.VITE_COUNTRIES_PATH;
const CITIES_PATH = import.meta.env.VITE_CITIES_PATH;
const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function CreateEvent() {
  const { profile } = useProfileContext();
  const axiosPrivate = useAxiosPrivate();

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
    created_at: new Date(),
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
        `${BASE_URL}/${EVENTS_PATH}`,
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
    <form className="create_event_wrapper" onSubmit={(e) => postEvent(e)}>
      {/* <BgFx2 /> */}
      <h1 style={{ color: "white" }}>Create new event</h1>
      <div style={{ display: "flex", flexDirection: "row", columnGap: "30px" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label className="create_event_wrapper__image">
            <div className="create_event_image_overlay">
              {imageFile && <img src={URL.createObjectURL(imageFile)} />}
            </div>
            <input
              className="create_event_wrapper__image_input"
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
          <label className="create_event_wrapper__title">
            <input
              className="create_event_wrapper__input"
              type="text"
              name="title"
              value={formValues.title}
              onChange={handleChange}
              placeholder="Event title"
            />
          </label>

          <label className="create_event_wrapper__description">
            <textarea
              className="create_event_wrapper__textarea"
              name="description"
              value={formValues.description}
              onChange={handleChange}
              placeholder="Event description"
            />
          </label>
          <label className="create_event_wrapper__date">
            <input
              className="create_event_wrapper__date_input"
              type="date"
              name="date"
              value={formValues.date}
              onChange={handleChange}
            />
          </label>
          <div className="create_event_wrapper__location">
            <label className="create_event_wrapper__country">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="create_event_wrapper__dropdown"
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

            <label className="create_event_wrapper__city">
              <select
                value={formValues.city}
                onChange={(e) =>
                  setFormValues((prev) => ({ ...prev, city: e.target.value }))
                }
                disabled={!selectedCountry}
                required
                className="create_event_wrapper__dropdown"
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
          <label htmlFor="isDigital" className="create_event_wrapper__digital">
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
            Is this event digital?
          </label>
          <button type="submit" className="event_submit_btn">
            Create Event
          </button>
        </div>
      </div>
    </form>
  );
}
