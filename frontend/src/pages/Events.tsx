// here needed: the last country/city checked is the preferred ones

import { useEffect, useState } from "react";
import { getWeekNumber, getDateOfISOWeek, addDays } from "../util/weekNumber";
import type { EventDto } from "../dto/EventDto";
import SingleEvent from "../components/Event";
import { useUserPreferencesContext } from "../context/UserPreferencesContext";
import { DateFormatter } from "../util/DateFormatter";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const EVENTS_PATH = import.meta.env.VITE_EVENTS_PATH;
const COUNTRIES_PATH = import.meta.env.VITE_COUNTRIES_PATH;
const CITIES_PATH = import.meta.env.VITE_CITIES_PATH;

export default function Events() {
  const { settings } = useUserPreferencesContext();
  const [weekMode, setWeekMode] = useState(true);
  const [events, setEvents] = useState<EventDto[]>([]);

  const date = new Date();
  const [weekNumber, setWeekNumber] = useState(getWeekNumber());
  const [dateOfISOWeek, setDateOfISOWeek] = useState(
    getDateOfISOWeek(weekNumber, date.getFullYear())
  );
  const [month, setMonth] = useState(date.getUTCMonth());
  const [year, setYear] = useState(date.getFullYear());

  const [countries, setCountries] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // initiate events page
  const init = async () => {
    await fetchCountries();
    if (settings) {
      setSelectedCountry(settings.eventPreferredCountry);
      const data = await getCitiesByCountry(settings.eventPreferredCountry);
      setSelectedCity(
        settings.eventPreferredCity === ""
          ? data[0]
          : settings.eventPreferredCity
      );
    }
  };
  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (settings) {
      const updateLocation = async () => {
        setSelectedCountry(settings.eventPreferredCountry);
        const data = await getCitiesByCountry(settings.eventPreferredCountry);
        setSelectedCity(
          settings.eventPreferredCity === ""
            ? data[0]
            : settings.eventPreferredCity
        );
      };
      if (settings.eventPreferredCountry !== "") {
        updateLocation();
      }
    }
  }, [settings]);

  useEffect(() => {
    if (!selectedCity) return;
    fetchEvents(weekNumber, month, year, selectedCity);
  }, [weekMode, weekNumber, month, year, selectedCity]);

  useEffect(() => {
    setDateOfISOWeek(getDateOfISOWeek(weekNumber, year));
  }, [weekNumber, year]);

  const fetchEvents = async (
    weekNumber: number,
    month: number,
    year: number,
    selectedCity: string
  ) => {
    const urlParams =
      `city=${selectedCity}&` +
      (weekMode ? `calenderWeek=${weekNumber}` : `month=${month}&year=${year}`);
    try {
      const response = await fetch(`${BASE_URL}/${EVENTS_PATH}?${urlParams}`);
      if (response.status === 200) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const updateCities = async () => {
      if (!selectedCountry) return;
      const data = await getCitiesByCountry(selectedCountry);
      setSelectedCity(data?.[0] || "");
    };
    updateCities();
  }, [selectedCountry]);

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
      setCities(data ?? []);
      return data ?? [];
    } catch (error) {
      console.error(error);
    }
  };

  const toggleView = () => {
    setWeekMode(!weekMode);
  };

  return (
    <div className="events_main">
      <div className="events_header">
        <div className="events_header_title">Events</div>
        <div className="events_header_buttons">
          <label className="popup_form__country">
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="popup_form__dropdown"
              required
            >
              <option value="">Country</option>
              {countries.map((country, i) => (
                <option key={country + i} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </label>

          <label className="popup_form__city">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              disabled={!selectedCountry}
              required
              className="popup_form__dropdown"
            >
              <option value="">City</option>
              {Array.isArray(cities) &&
                cities.map((city, i) => (
                  <option key={city + i} value={city}>
                    {city}
                  </option>
                ))}
            </select>
          </label>
          <button
            className="events_header_week_month_button"
            onClick={toggleView}
          >
            {weekMode ? "Monthly View" : "Weekly View"}
          </button>
        </div>
      </div>
      <div className="events_weekbox">
        <div className="events_weekbox_left_button">
          <img
            onClick={() => setWeekNumber((prev) => prev - 1)}
            src="/arrow_left.svg"
            alt="events previous week button"
          />
        </div>
        <div className="events_weekbox_days">
          <div className="events_weekbox_day">
            Mo
            <span>{DateFormatter.extractDayMonth(dateOfISOWeek)}</span>
          </div>
          <div className="events_weekbox_day">
            Tu
            <span>
              {DateFormatter.extractDayMonth(addDays(dateOfISOWeek, 1))}
            </span>
          </div>
          <div className="events_weekbox_day">
            Wed
            <span>
              {DateFormatter.extractDayMonth(addDays(dateOfISOWeek, 2))}
            </span>
          </div>
          <div className="events_weekbox_day">
            Thu
            <span>
              {DateFormatter.extractDayMonth(addDays(dateOfISOWeek, 3))}
            </span>
          </div>
          <div className="events_weekbox_day">
            Fr
            <span>
              {DateFormatter.extractDayMonth(addDays(dateOfISOWeek, 4))}
            </span>
          </div>
          <div className="events_weekbox_day">
            Sa
            <span>
              {DateFormatter.extractDayMonth(addDays(dateOfISOWeek, 5))}
            </span>
          </div>
          <div className="events_weekbox_day">
            Sun
            <span>
              {DateFormatter.extractDayMonth(addDays(dateOfISOWeek, 6))}
            </span>
          </div>
        </div>

        <div className="events_weekbox_right_button">
          <img
            onClick={() => setWeekNumber((prev) => prev + 1)}
            src="/arrow_right.svg"
            alt="events next week button"
          />
        </div>
      </div>
      <div className="events_display_wrapper">
        <div className="events_display_day">
          {events
            .filter(
              (e) =>
                DateFormatter.extractDayMonth(new Date(e.date)) ===
                DateFormatter.extractDayMonth(addDays(dateOfISOWeek, 0))
            )
            .map((e, i) => (
              <SingleEvent key={i} event={e} />
            ))}
        </div>
        <div className="events_display_day">
          {events
            .filter(
              (e) =>
                DateFormatter.extractDayMonth(new Date(e.date)) ===
                DateFormatter.extractDayMonth(addDays(dateOfISOWeek, 1))
            )
            .map((e, i) => (
              <SingleEvent key={i} event={e} />
            ))}
        </div>
        <div className="events_display_day">
          {events
            .filter(
              (e) =>
                DateFormatter.extractDayMonth(new Date(e.date)) ===
                DateFormatter.extractDayMonth(addDays(dateOfISOWeek, 2))
            )
            .map((e, i) => (
              <SingleEvent key={i} event={e} />
            ))}
        </div>
        <div className="events_display_day">
          {events
            .filter(
              (e) =>
                DateFormatter.extractDayMonth(new Date(e.date)) ===
                DateFormatter.extractDayMonth(addDays(dateOfISOWeek, 3))
            )
            .map((e, i) => (
              <SingleEvent key={i} event={e} />
            ))}
        </div>
        <div className="events_display_day">
          {events
            .filter(
              (e) =>
                DateFormatter.extractDayMonth(new Date(e.date)) ===
                DateFormatter.extractDayMonth(addDays(dateOfISOWeek, 4))
            )
            .map((e, i) => (
              <SingleEvent key={i} event={e} />
            ))}
        </div>
        <div className="events_display_day">
          {events
            .filter(
              (e) =>
                DateFormatter.extractDayMonth(new Date(e.date)) ===
                DateFormatter.extractDayMonth(addDays(dateOfISOWeek, 5))
            )
            .map((e, i) => (
              <SingleEvent key={i} event={e} />
            ))}
        </div>
        <div className="events_display_day">
          {events
            .filter(
              (e) =>
                DateFormatter.extractDayMonth(new Date(e.date)) ===
                DateFormatter.extractDayMonth(addDays(dateOfISOWeek, 6))
            )
            .map((e, i) => (
              <SingleEvent key={i} event={e} />
            ))}
        </div>
      </div>
    </div>
  );
}
