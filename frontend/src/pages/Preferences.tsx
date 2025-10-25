import { useSelector } from "react-redux";
import { useUserPreferencesContext } from "../context/PreferencesContext";
import type { Preferences } from "../dto/Preferences";
import type { RootState } from "../store/store";
import { useCallback, useEffect, useState } from "react";

const CITIES_PATH = import.meta.env.VITE_CITIES_PATH;

export default function Preferences() {
  const { preferences, setPreference } = useUserPreferencesContext();
  const countries = useSelector((state: RootState) => state.location.countries);

  const [selectedCountry, setSelectedCountry] = useState<string>(
    preferences?.preferredCountry || ""
  );
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>(
    preferences?.preferredCity || ""
  );

  const handleChange = useCallback(
    (key: keyof Preferences, value: string | boolean | number) => {
      setPreference(key, value);
    },
    [setPreference]
  );

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    handleChange("preferredCountry", country);
    setSelectedCity("");
    handleChange("preferredCity", "");
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    handleChange("preferredCity", city);
  };

  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedCountry) {
        setCities([]);
        return;
      }
      try {
        const response = await fetch(
          `${CITIES_PATH}/by_country/${selectedCountry}`
        );
        const data = await response.json();
        setCities(data ?? []);
      } catch (error) {
        console.error("Error fetching cities:", error);
        setCities([]);
      }
    };
    fetchCities();
  }, [selectedCountry]);

  useEffect(() => {
    if (preferences) {
      setSelectedCountry(preferences.preferredCountry || "");
      setSelectedCity(preferences.preferredCity || "");
    }
  }, [preferences]);

  return (
    <div
      style={{ paddingTop: "100px", color: "red" }}
      className="preferences_container"
    >
      <h1>User Preferences</h1>
      <form id="preferencesForm">
        <label>
          <input
            checked={preferences?.notifications || false}
            onChange={(e) => handleChange("notifications", e.target.checked)}
            type="checkbox"
            id="notifications"
            name="notifications"
          />
          Enable Notifications
        </label>

        <label>
          <input
            onChange={(e) => handleChange("animations", e.target.checked)}
            checked={preferences?.animations || false}
            type="checkbox"
            id="animations"
            name="animations"
          />
          Enable Animations
        </label>

        <label>
          <select
            value={selectedCountry}
            onChange={(e) => handleCountryChange(e.target.value)}
            required
            className="events_location_select"
          >
            <option value="">Country</option>
            {countries.map((country, i) => (
              <option key={country + i} value={country}>
                {country}
              </option>
            ))}
          </select>
        </label>

        <label>
          <select
            value={selectedCity}
            onChange={(e) => handleCityChange(e.target.value)}
            disabled={!selectedCountry}
            required
            className="events_location_select"
          >
            <option value="">City</option>
            {cities.map((city, i) => (
              <option key={city + i} value={city}>
                {city}
              </option>
            ))}
          </select>
        </label>
      </form>
    </div>
  );
}
