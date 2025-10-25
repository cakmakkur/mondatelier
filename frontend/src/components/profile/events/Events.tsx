import { useEffect, useState } from "react";
import SingleEvent from "./Event";

import type { Profile } from "../../../dto/Profile";
import type { EventDto } from "../../../dto/EventDto";

interface EventsProps {
  profile: Profile;
}

const EVENTS_PATH = import.meta.env.VITE_EVENTS_PATH;

export default function Events({ profile }: EventsProps) {
  const [events, setEvents] = useState<EventDto[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch(`${EVENTS_PATH}/profile/${profile.id}`);
      const data = await response.json();
      setEvents(data);
    };
    fetchEvents();
  }, [profile]);

  return (
    <div className="profile-events d-flex">
      {events.map((event) => (
        <SingleEvent key={event.id} event={event} />
      ))}
    </div>
  );
}
