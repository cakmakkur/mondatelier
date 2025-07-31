import { useEffect, useState } from "react";
import type { EventDto } from "../dto/EventDto";
import { DateFormatter } from "../util/DateFormatter";
import type { Profile } from "../dto/Profile";

interface EventPropTypes {
  event: EventDto;
}

const BASE_URL = import.meta.env.VITE_BASE_URL;
const UPLOADS_PATH = import.meta.env.VITE_UPLOADS_URL;
const PROFILE_PATH = import.meta.env.VITE_PROFILE_PATH;

export default function Event({ event }: EventPropTypes) {
  const [posterProfile, setPosterProfile] = useState<Profile | null>(null);

  const fetchProfile = async () => {
    const response = await fetch(
      `${BASE_URL}/${PROFILE_PATH}/${event.profileId}`
    );
    const data = await response.json();
    setPosterProfile(data);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="event_main">
      <div className="event_image">
        <img
          src={`${BASE_URL}/${UPLOADS_PATH}/${event.thumbnail_url}`}
          alt="event cover image"
        />
      </div>
      <div className="event_details">
        <div>{event.title}</div>
        <div>{DateFormatter.extractDayMonth(event.date)}</div>
        <div>{event.description}</div>
        <div>
          <img
            src={`${BASE_URL}/${UPLOADS_PATH}/${posterProfile?.profilePicturePath}`}
            alt="profile picture of event poster"
          />
        </div>
      </div>
      <div className="event_buttons">
        <button>Like</button>
      </div>
    </div>
  );
}
