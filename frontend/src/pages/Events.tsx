import { useCallback, useEffect, useRef, useState } from "react";
import { getWeekNumber, getDateOfISOWeek, addDays } from "../util/weekNumber";
import SingleEvent from "../components/event/Event";
import { useUserPreferencesContext } from "../context/PreferencesContext";
import { DateFormatter } from "../util/DateFormatter";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { addProfiles, addEvents } from "../store/eventSlice";
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

  const initialDate = new Date();
  const [dateOfISOWeek, setDateOfISOWeek] = useState(
    getDateOfISOWeek(getWeekNumber(initialDate), initialDate.getFullYear())
  );
  const weekNumber = getWeekNumber(dateOfISOWeek);
  const year = addDays(dateOfISOWeek, 3).getFullYear();
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const profilesRef = useRef(profiles);

  useEffect(() => {
    profilesRef.current = profiles;
  }, [profiles]);

  const getCitiesByCountry = useCallback(async (country: string) => {
    try {
      const response = await fetch(`${CITIES_PATH}/by_country/${country}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch cities (${response.status})`);
      }
      const data: string[] = await response.json();
      setCities(data ?? []);
      return data ?? [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }, []);

  const fetchProfiles = useCallback(
    async (eventsData: EventDto[]) => {
      const missingProfileIds = [
        ...new Set(
          eventsData
            .map((event) => event.profileId)
            .filter((profileId) => !profilesRef.current[profileId])
        ),
      ];
      const fetchedProfiles = await Promise.all(
        missingProfileIds.map(async (profileId) => {
          const response = await fetch(`${PROFILE_PATH}/${profileId}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch profile (${response.status})`);
          }
          return response.json();
        })
      );
      if (fetchedProfiles.length > 0) {
        dispatch(addProfiles(fetchedProfiles));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (!settings?.preferredCountry) return;

    const updateLocation = async () => {
      setSelectedCountry(settings.preferredCountry ?? "");
      const data = await getCitiesByCountry(settings.preferredCountry ?? "");
      const preferredCity = settings.preferredCity ?? "";
      setSelectedCity(
        preferredCity && data.includes(preferredCity) ? preferredCity : data[0] ?? ""
      );
    };
    void updateLocation();
  }, [getCitiesByCountry, settings?.preferredCity, settings?.preferredCountry]);

  const fetchEvents = useCallback(
    async (targetWeek: number, targetYear: number, city: string) => {
      const urlParams = new URLSearchParams({
        city,
        calenderWeek: String(targetWeek),
        year: String(targetYear),
      });
      try {
        const response = await fetch(`${EVENTS_PATH}?${urlParams}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch events (${response.status})`);
        }
        const data: EventDto[] = await response.json();
        await fetchProfiles(data);
        dispatch(addEvents(data));
      } catch (error) {
        console.error(error);
        dispatch(addEvents([]));
      }
    },
    [dispatch, fetchProfiles]
  );

  // fetch events and associated profiles
  useEffect(() => {
    if (!selectedCity) return;
    dispatch(addEvents([]));
    void fetchEvents(weekNumber, year, selectedCity);
  }, [dispatch, fetchEvents, selectedCity, weekNumber, year]);

  // clear events when leaving the page
  useEffect(() => {
    return () => {
      dispatch(addEvents([]));
    };
  }, [dispatch]);

  const handleCountryChange = async (country: string) => {
    setSelectedCountry(country);
    if (!country) {
      setCities([]);
      setSelectedCity("");
      return;
    }
    const data = await getCitiesByCountry(country);
    setSelectedCity(data[0] ?? "");
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
          <Carousel
            imgUrls={[
              "/events_poster_2.png",
              "/events_poster_2.png",
              "/events_poster_2.png",
            ]}
          />
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
                  onChange={(e) => void handleCountryChange(e.target.value)}
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
            onClick={() => setDateOfISOWeek((previous) => addDays(previous, -7))}
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
            onClick={() => setDateOfISOWeek((previous) => addDays(previous, 7))}
            src="/arrow_right.svg"
            alt="events next week button"
          />
        </div>
      </div>
      {Object.keys(events).length === 0 ? (
        <div className="events_no_events">No events found</div>
      ) : (
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
      )}
      <div className="events_display_wrapper"></div>
    </div>
  );
}
