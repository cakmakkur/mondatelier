import { useEffect, useState } from "react";
import { getWeekNumber } from "../util/weekNumber";
import type { Event } from "../dto/Event";
import SingleEvent from "../components/Event";

const UPLOADS_PATH = import.meta.env.VITE_UPLOADS_URL;
const BASE_URL = import.meta.env.VITE_BASE_URL;
const EVENTS_PATH = import.meta.env.VITE_EVENTS_PATH;

export default function Events() {
  const [weekMode, setWeekMode] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);

  const date = new Date();

  const fetchEvents = async () => {
    const urlParams = weekMode
      ? `calenderWeek=${getWeekNumber()}`
      : `month=${date.getUTCMonth()}&year=${date.getFullYear()}`;
    try {
      const response = await fetch(`${BASE_URL}/${EVENTS_PATH}?${urlParams}`);
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="events_main">
      <div className="events_header">
        <div className="events_header_title">Events</div>
        <div className="events_header_buttons">
          <button>Location</button>
          <button>Month View</button>
        </div>
      </div>
      <div className="events_weekbox">
        <div className="events_weekbox_day">Mo</div>
        <div className="events_weekbox_day">Tu</div>
        <div className="events_weekbox_day">Wed</div>
        <div className="events_weekbox_day">Thu</div>
        <div className="events_weekbox_day">Fr</div>
        <div className="events_weekbox_day">Sa</div>
        <div className="events_weekbox_day">Sun</div>
      </div>
      {/* <div className="events_display_wrapper">
        <div className="events_display_day">
          {events.map((e, i) => (
            <SingleEvent key={i} event={e} />
          ))}
        </div>
        <div className="events_display_day">
          {" "}
          {events.map((e, i) => (
            <SingleEvent key={i} event={e} />
          ))}
        </div>
        <div className="events_display_day">
          {" "}
          {events.map((e, i) => (
            <SingleEvent key={i} event={e} />
          ))}
        </div>
        <div className="events_display_day">
          {" "}
          {events.map((e, i) => (
            <SingleEvent key={i} event={e} />
          ))}
        </div>
        <div className="events_display_day">
          {" "}
          {events.map((e, i) => (
            <SingleEvent key={i} event={e} />
          ))}
        </div>
        <div className="events_display_day">
          {" "}
          {events.map((e, i) => (
            <SingleEvent key={i} event={e} />
          ))}
        </div>
        <div className="events_display_day">
          {" "}
          {events.map((e, i) => (
            <SingleEvent key={i} event={e} />
          ))}
        </div>
      </div> */}
    </div>
  );
}
