import { useSelector } from "react-redux";
import type { EventDto } from "../../dto/EventDto";
import type { RootState } from "../../store/store";
import { Link } from "react-router-dom";
import { useModalContext } from "../../context/ModalContext";
import { useEffect, useRef, useState } from "react";
import useAxiosPrivate from "../../auth/useAxiosPrivate";
import { useAuthContext } from "../../auth/AuthContext";

interface EventPropTypes {
  event: EventDto;
}

const UPLOADS_PATH = import.meta.env.VITE_MEDIA_URL;

export default function EventModalView({ event }: EventPropTypes) {
  const profiles = useSelector((state: RootState) => state.event.profiles);
  const profile = profiles[event.profileId];
  const heartIconEmptyRef = useRef<HTMLImageElement>(null);
  const heartIconFillRef = useRef<HTMLImageElement>(null);
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuthContext();
  const [isLiked, setIsLiked] = useState(false);

  const { setComponentState } = useModalContext();

  const handleLikeClick = async () => {
    if (!auth) return; // here sign in modal
    if (isLiked) {
      setIsLiked(false);
    } else {
      setIsLiked(true);
    }
  };

  useEffect(() => {
    if (!heartIconEmptyRef.current || !heartIconFillRef.current) return;

    if (isLiked) {
      // liked → show fill, hide empty
      heartIconFillRef.current.classList.remove(
        "post-profile--right-like-inactive"
      );
      heartIconFillRef.current.classList.add("post-profile--right-like-active");

      heartIconEmptyRef.current.classList.remove(
        "post-profile--right-like-active"
      );
      heartIconEmptyRef.current.classList.add(
        "post-profile--right-like-inactive"
      );
    } else {
      // not liked → show empty, hide fill
      heartIconEmptyRef.current.classList.remove(
        "post-profile--right-like-inactive"
      );
      heartIconEmptyRef.current.classList.add(
        "post-profile--right-like-active"
      );

      heartIconFillRef.current.classList.remove(
        "post-profile--right-like-active"
      );
      heartIconFillRef.current.classList.add(
        "post-profile--right-like-inactive"
      );
    }
  }, [isLiked]);

  return (
    <div className="event_popup_wrapper">
      <div className="event_popup">
        <div className="event_popup_image">
          <img src={`${UPLOADS_PATH}${event.thumbnail_url}`} alt="" />
        </div>
        <div className="event_popup_details">
          <div className="event_popup_title">
            <h1>{event.title}</h1>
          </div>
          <h3 className="event_popup_description">{event.description}</h3>
          <div className="event_popup_location_wrapper">
            <img
              className="event_popup_location_img"
              src="/location.svg"
              alt=""
            />{" "}
            {event.city}
          </div>
          <div>
            <Link
              onClick={() => setComponentState(undefined)}
              className="event_popup_profile"
              to={`/profile/${event.profileId}`}
            >
              <img
                className="event_popup_profile_img"
                src={`${UPLOADS_PATH}${profile?.profilePicturePath}`}
                alt="profile picture of the event poster"
              />
              <span className="event_popup_profile_name">
                {profile?.profileName}
              </span>
            </Link>
          </div>
          <menu className="d-flex flex-row align-items-center w-100">
            <span
              onClick={handleLikeClick}
              className="post-profile--right-like"
            >
              <img
                ref={heartIconEmptyRef}
                className="post-profile--right-like-empty"
                src="/heart.svg"
                alt="like icon"
              />
              <img
                ref={heartIconFillRef}
                className="post-profile--right-like-fill"
                src="/heart-fill.svg"
                alt="unlike icon"
              />
            </span>
            <button className="event_buttons__like">
              <img src="/share.svg" alt="event share button" />
            </button>
          </menu>
        </div>
      </div>
    </div>
  );
}
