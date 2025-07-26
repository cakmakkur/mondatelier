import { useEffect, useState } from "react";
import { useProfileContext } from "../../context/ProfileContext";

// @ts-expect-error auth context
import useAxiosPrivate from "../../auth/useAxiosPrivate";

const EVENTS_PATH = import.meta.env.VITE_EVENTS_PATHL;
const COUNTRIES_PATH = import.meta.env.VITE_COUNTRIES_PATH;
const CITIES_PATH = import.meta.env.VITE_CITIES_PATH;
const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function CreateEvent() {
  const { profile } = useProfileContext();
  const { axiosPrivate } = useAxiosPrivate();

  const [countries, setCountries] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("Austria");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formValues, setFormValues] = useState({
    id: "",
    title: "",
    type: 1,
    city: "",
    description: "",
    date: "",
    profileId: "",
  });

  const postEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("event", JSON.stringify(formValues));

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await axiosPrivate.post(
        `${BASE_URL}/${EVENTS_PATH}`,
        formData
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
    };

    initiateEventForm();
  }, []);

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
      <label className="create_event_wrapper__image">
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
      </label>
      <label className="create_event_wrapper__date">
        <input
          type="date"
          name="date"
          value={formValues.date}
          onChange={handleChange}
        />
      </label>

      <label className="create_event_wrapper__title">
        <input
          type="text"
          name="title"
          value={formValues.title}
          onChange={handleChange}
          placeholder="Event title"
        />
      </label>

      <label className="create_event_wrapper__description">
        <textarea
          name="description"
          value={formValues.description}
          onChange={handleChange}
          placeholder="Event description"
        />
      </label>

      <label className="create_event_wrapper__country">
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
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
        >
          <option value="">Select city</option>
          {cities.map((city, i) => (
            <option key={city + i} value={city}>
              {city}
            </option>
          ))}
        </select>
      </label>

      <button type="submit" className="submit_btn">
        Create Event
      </button>
    </form>
  );
}
