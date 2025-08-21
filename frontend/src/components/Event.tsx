import type { EventDto } from "../dto/EventDto";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

interface EventPropTypes {
  event: EventDto;
}

const BASE_URL = import.meta.env.VITE_BASE_URL;
const UPLOADS_PATH = import.meta.env.VITE_UPLOADS_URL;

export default function Event({ event }: EventPropTypes) {
  const profiles = useSelector((state: RootState) => state.event.profiles);
  const profile = profiles[event.profileId];

  return (
    <div
      className={`event_main ${
        event.type === 1 ? "event_main--digital" : "event_main--physical"
      }`}
    >
      <div className="event_image">
        <img
          src={`${UPLOADS_PATH}${event.thumbnail_url}`}
          alt="event cover image"
        />
      </div>
      <div className="event_details">
        <div className="event_title">{event.title}</div>
        <div>{event.description}</div>
        <div className="event_profile">
          <img
            className="event_profile_picture"
            src={`${UPLOADS_PATH}${profile?.profilePicturePath}`}
            alt="profile picture of the event poster"
          />
          <span className="event_profile_name">{profile?.profileName}</span>
        </div>
      </div>
      <div className="event_buttons">
        <button>Like</button>
      </div>
    </div>
  );
}
