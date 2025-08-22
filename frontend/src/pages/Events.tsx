// here needed: the last country/city checked is the preferred ones

import { useEffect, useState } from "react";
import { getWeekNumber, getDateOfISOWeek, addDays } from "../util/weekNumber";
import SingleEvent from "../components/Event";
import { useUserPreferencesContext } from "../context/UserPreferencesContext";
import { DateFormatter } from "../util/DateFormatter";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { addProfile, addEvents } from "../store/eventSlice";
import type { EventDto } from "../dto/EventDto";
import BgFx3 from "../components/fx/BgFx3";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const EVENTS_PATH = import.meta.env.VITE_EVENTS_PATH;
const CITIES_PATH = import.meta.env.VITE_CITIES_PATH;
const PROFILE_PATH = import.meta.env.VITE_PROFILE_PATH;

export default function Events() {
  const dispatch = useDispatch();
  const profiles = useSelector((state: RootState) => state.event.profiles);
  const events = useSelector((state: RootState) => state.event.events);
  const countries = useSelector((state: RootState) => state.location.countries);

  const { settings } = useUserPreferencesContext();
  const [weekMode, setWeekMode] = useState(true);

  const date = new Date();
  const [weekNumber, setWeekNumber] = useState(getWeekNumber());
  const [dateOfISOWeek, setDateOfISOWeek] = useState(
    getDateOfISOWeek(weekNumber, date.getFullYear())
  );
  const [month, setMonth] = useState(date.getUTCMonth());
  const [year, setYear] = useState(date.getFullYear());

  const [cities, setCities] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // initiate events page
  useEffect(() => {
    const init = async () => {
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
    init();
  }, []);

  // fetches profile if it hasn't been fetched yet
  const fetchProfiles = async (eventsData: EventDto[]) => {
    for (const event of eventsData) {
      const profileId = event.profileId;
      if (!profiles[profileId]) {
        const profile = await fetch(
          `${BASE_URL}/${PROFILE_PATH}/${profileId}`
        ).then((res) => res.json());
        dispatch(addProfile({ profileId, profile }));
      }
    }
  };

  // determine preferred location
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

  // fetch events and associated profiles
  useEffect(() => {
    if (!selectedCity) return;
    dispatch(addEvents([]));

    fetchEvents(weekNumber, month, year, selectedCity);
  }, [weekMode, weekNumber, month, year, selectedCity]);

  // clear events when leaving the page
  useEffect(() => {
    return () => {
      dispatch(addEvents([]));
    };
  }, [dispatch]);

  // determine date of ISO week
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
        dispatch(addEvents(data));
        await fetchProfiles(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // get cities for selected country
  useEffect(() => {
    const updateCities = async () => {
      if (!selectedCountry) return;
      const data = await getCitiesByCountry(selectedCountry);
      setSelectedCity(data?.[0] || "");
    };
    updateCities();
  }, [selectedCountry]);

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

  // toggle between week mode and month mode
  const toggleView = () => {
    setWeekMode(!weekMode);
  };

  return (
    <div className="events_main">
      <BgFx3 />
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
        <div className="events_display_event">
          {Object.values(events)
            .filter(
              (e) =>
                DateFormatter.extractDayMonth(new Date(e.date)) ===
                DateFormatter.extractDayMonth(addDays(dateOfISOWeek, 0))
            )
            .map((e, i) => (
              <SingleEvent key={i} event={e} />
            ))}
        </div>
        <div className="events_display_event">
          {Object.values(events)
            .filter(
              (e) =>
                DateFormatter.extractDayMonth(new Date(e.date)) ===
                DateFormatter.extractDayMonth(addDays(dateOfISOWeek, 1))
            )
            .map((e, i) => (
              <SingleEvent key={i} event={e} />
            ))}
        </div>
        <div className="events_display_event">
          {Object.values(events)
            .filter(
              (e) =>
                DateFormatter.extractDayMonth(new Date(e.date)) ===
                DateFormatter.extractDayMonth(addDays(dateOfISOWeek, 2))
            )
            .map((e, i) => (
              <SingleEvent key={i} event={e} />
            ))}
        </div>
        <div className="events_display_event">
          {Object.values(events)
            .filter(
              (e) =>
                DateFormatter.extractDayMonth(new Date(e.date)) ===
                DateFormatter.extractDayMonth(addDays(dateOfISOWeek, 3))
            )
            .map((e, i) => (
              <SingleEvent key={i} event={e} />
            ))}
        </div>
        <div className="events_display_event">
          {Object.values(events)
            .filter(
              (e) =>
                DateFormatter.extractDayMonth(new Date(e.date)) ===
                DateFormatter.extractDayMonth(addDays(dateOfISOWeek, 4))
            )
            .map((e, i) => (
              <SingleEvent key={i} event={e} />
            ))}
        </div>
        <div className="events_display_event">
          {Object.values(events)
            .filter(
              (e) =>
                DateFormatter.extractDayMonth(new Date(e.date)) ===
                DateFormatter.extractDayMonth(addDays(dateOfISOWeek, 5))
            )
            .map((e, i) => (
              <SingleEvent key={i} event={e} />
            ))}
        </div>
        <div className="events_display_event">
          {Object.values(events)
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
