import type { EventDto } from "../../../dto/EventDto";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { useModalContext } from "../../../context/ModalContext";
import EventModalView from "../../event/EventModalView";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../../auth/AuthContext";
import type { Profile } from "../../../dto/Profile";

interface EventPropTypes {
  event: EventDto;
}
const UPLOADS_PATH = import.meta.env.VITE_MEDIA_URL;
const PROFILE_PATH = import.meta.env.VITE_PROFILE_PATH;

export default function Event({ event }: EventPropTypes) {
  const { auth } = useAuthContext();
  const profiles = useSelector((state: RootState) => state.event.profiles);
  const [profile, setProfile] = useState<Profile | null>(null);

  const { setComponentState } = useModalContext();

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${PROFILE_PATH}/${event.profileId}`);
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    const cachedProfile = profiles[event.profileId];
    if (cachedProfile) {
      setProfile(cachedProfile);
    } else {
      fetchProfile();
    }
  }, [event]);

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
      <section className="event_image">
        <img
          src={`${UPLOADS_PATH}${event.thumbnail_url}`}
          alt="event cover image"
        />
        {event.type === 1 ? (
          <div className="event_digital_banner">DIGITAL</div>
        ) : (
          ""
        )}
      </section>
      <section className="event_details">
        <div className="event_title">{event.title}</div>
        <div className="event_description">{event.description}</div>
        {(!auth || auth.profileId !== event.profileId) && (
          <div className="event_profile">
            <img
              className="event_profile_picture"
              src={`${UPLOADS_PATH}${profile?.profilePicturePath}`}
              alt="profile picture of the event poster"
            />
            <span className="event_profile_name">{profile?.profileName}</span>
          </div>
        )}
      </section>
    </div>
  );
}
