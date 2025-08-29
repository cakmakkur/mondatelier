import { useEffect, useState } from "react";
import { getWeekNumber, getDateOfISOWeek, addDays } from "../util/weekNumber";
import SingleEvent from "../components/Event";
import { useUserPreferencesContext } from "../context/PreferencesContext";
import { DateFormatter } from "../util/DateFormatter";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { addProfile, addEvents } from "../store/eventSlice";
import type { EventDto } from "../dto/EventDto";
import BgFx3 from "../components/fx/BgFx3";
import { useAuthContext } from "../auth/AuthContext";
import CreateEvent from "../components/userActions/CreateEvent";
import { useModalContext } from "../context/ModalContext";
import Login from "../components/auth/Login";
import Carousel from "../components/fx/Carousel";

const EVENTS_PATH = import.meta.env.VITE_EVENTS_PATH;
const CITIES_PATH = import.meta.env.VITE_CITIES_PATH;
const PROFILE_PATH = import.meta.env.VITE_PROFILE_PATH;

export default function Events() {
  const dispatch = useDispatch();
  const { auth } = useAuthContext();
  const { setComponentState } = useModalContext();
  const profiles = useSelector((state: RootState) => state.event.profiles);
  const events = useSelector((state: RootState) => state.event.events);
  const countries = useSelector((state: RootState) => state.location.countries);

  const { preferences: settings } = useUserPreferencesContext();

  const date = new Date();
  const [weekNumber, setWeekNumber] = useState(getWeekNumber());
  const [dateOfISOWeek, setDateOfISOWeek] = useState(
    getDateOfISOWeek(weekNumber, date.getFullYear())
  );
  const year = date.getFullYear();
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

  // doesnt work correct. check it later
  // fetches profile if it hasn't been fetched yet
  const fetchProfiles = async (eventsData: EventDto[]) => {
    for (const event of eventsData) {
      const profileId = event.profileId;
      if (!profiles[profileId]) {
        const profile = await fetch(`${PROFILE_PATH}/${profileId}`).then(
          (res) => res.json()
        );
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
    fetchEvents(weekNumber, selectedCity);
  }, [weekNumber, selectedCity]);

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

  const fetchEvents = async (weekNumber: number, selectedCity: string) => {
    const urlParams = `city=${selectedCity}&` + `calenderWeek=${weekNumber}`;
    try {
      const response = await fetch(`${EVENTS_PATH}?${urlParams}`);
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
      const response = await fetch(`${CITIES_PATH}/by_country/${country}`);
      const data = await response.json();
      setCities(data ?? []);
      return data ?? [];
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateEventClick = () => {
    if (auth) {
      setComponentState(CreateEvent);
    } else {
      setComponentState(Login);
    }
  };

  // useEffect(() => {
  //   async function fetchHighlightEvents() {
  //     try {
  //       const response = await fetch(`${EVENTS_PATH}/highlights`);
  //       console.log(response);

  //       const events = await response.json();
  //       console.log("success");

  //       events.map((event: EventDto, i: number) => {
  //         if (i < 5) {
  //           setImgUrls((prev) => [
  //             ...prev,
  //             `${UPLOADS_URL}/${event.thumbnail_url}`,
  //           ]);
  //         }
  //         console.log("set");
  //       });
  //     } catch {
  //       console.log("Error fetching homepage highlights images");
  //     }
  //   }
  //   fetchHighlightEvents();
  // }, []);

  return (
    <div className="events_main">
      <BgFx3 />
      <div className="events_header">
        <div className="events_header--left">
          <Carousel imgUrls={["/events_poster_2.png"]} />
        </div>
        <div className="events_header--right">
          <div className="events_header_title">
            <span className="events_header_title_text">Events</span>{" "}
            <button
              onClick={handleCreateEventClick}
              className="events_publish_event_button"
            >
              <img src="/add_circle_moon.svg" alt="" />
              Publish a new event
            </button>
          </div>
          <div className="events_header_buttons_container">
            <div className="events_header_buttons">
              <img
                className="events_header_location_img"
                src="/location.svg"
                alt=""
              />

              <label className="events_location_dropdown">
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
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

              <label className="events_location_dropdown">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  disabled={!selectedCountry}
                  required
                  className="events_location_select"
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
            </div>
          </div>
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
