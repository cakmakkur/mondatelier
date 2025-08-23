import type { EventDto } from "../dto/EventDto";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { useModalContext } from "../context/ModalContext";
import EventModalView from "./EventModalView";

interface EventPropTypes {
  event: EventDto;
}
const UPLOADS_PATH = import.meta.env.VITE_UPLOADS_URL;

export default function Event({ event }: EventPropTypes) {
  const profiles = useSelector((state: RootState) => state.event.profiles);
  const profile = profiles[event.profileId];
  const { setComponentState } = useModalContext();

  const handleClick = () => {
    setComponentState(EventModalView, { event });
  };

  return (
    <div
      className={`event_main ${
        event.type === 1 ? "event_main--digital" : "event_main--physical"
      }`}
      onClick={handleClick}
    >
      <div className="event_image">
        <img
          src={`${UPLOADS_PATH}${event.thumbnail_url}`}
          alt="event cover image"
        />
      </div>
      <div className="event_details">
        <div className="event_title">{event.title}</div>
        <div className="event_description">{event.description}</div>
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
        <button className="event_buttons__like">
          <img src="/thumb_up.svg" alt="" /> Like
        </button>
      </div>
    </div>
  );
}
