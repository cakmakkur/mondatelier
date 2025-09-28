import { useEffect, useState } from "react";
import About from "../components/profile/About";
import Art from "../components/profile/art/Art";
import Collections from "../components/profile/Collections";
import ProfileDisplaySections from "../components/profile/ProfileDisplaySections";
import { useAuthContext } from "../auth/AuthContext";
import { Link, useParams } from "react-router-dom";
import type { Profile } from "../dto/Profile";
import { useProfileContext } from "../context/ProfileContext";
import type Freelance from "../dto/Freelance";
import type Masterclass from "../dto/Masterclass";
import { FormatUrl } from "../util/formatUrl";
import CreateEvent from "../components/userActions/CreateEvent";
import { useModalContext } from "../context/ModalContext";
import CreateMasterclass from "../components/userActions/CreateMasterclass";
import CreateFreelance from "../components/userActions/CreateFreelance";
import Liked from "../components/profile/Liked";
import Masterclasses from "../components/profile/Masterclasses";
import Events from "../components/profile/Events";
import Freelances from "../components/profile/Freelances";
import ImageUploader from "../components/userActions/ImageUploader";

const UPLOADS_PATH = import.meta.env.VITE_MEDIA_URL;
const PROFILE_PATH = import.meta.env.VITE_PROFILE_PATH;
const FREELANCE_PATH = import.meta.env.VITE_FREELANCE_PATH;
const MASTERCLASS_PATH = import.meta.env.VITE_MASTERCLASS_PATH;

export default function Profile() {
  const [section, setSection] = useState<string>("about");
  const { auth } = useAuthContext();
  const { profile } = useProfileContext();
  const [isOwnProfile, setIsOwnProfile] = useState<boolean>(false);
  const { profileId } = useParams();
  const [currentProfile, setCurrentProfile] = useState<
    Profile | null | undefined
  >(null);
  const [freelances, setFreelances] = useState<Freelance[]>([]);
  const [masterclasses, setMasterclasses] = useState<Masterclass[]>([]);
  const [ppPath, setPpPath] = useState("/person.svg");
  const [bannerPath, setBannerPath] = useState("");
  const { setComponentState } = useModalContext();

  const fetchMasterclasses = async () => {
    try {
      const response = await fetch(
        `${MASTERCLASS_PATH}?profileId=${profileId}`
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error("Failed to fetch masterclasses");
      }
      setMasterclasses(data);
    } catch (error) {
      console.error("Error fetching masterclasses:", error);
    }
  };

  const fetchFreelances = async () => {
    try {
      const response = await fetch(`${FREELANCE_PATH}?profileId=${profileId}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error("Failed to fetch masterclasses");
      }
      setFreelances(data);
    } catch (error) {
      console.error("Error fetching freelances:", error);
    }
  };

  const handlePPEditClick = () => {
    setComponentState(ImageUploader, {
      targetUrl: `${PROFILE_PATH}/profilePicture/${profileId}`,
    });
  };

  const handleBannerEditClick = () => {
    setComponentState(ImageUploader, {
      targetUrl: `${PROFILE_PATH}/bannerImage/${profileId}`,
    });
  };

  useEffect(() => {
    if (
      currentProfile &&
      currentProfile.profilePicturePath !== null &&
      currentProfile.profilePicturePath !== ""
    ) {
      setPpPath(`${UPLOADS_PATH}${currentProfile.profilePicturePath}`);
    } else {
      setPpPath("/person.svg");
    }
  }, [currentProfile]);

  useEffect(() => {
    if (
      currentProfile &&
      currentProfile.bannerPath !== null &&
      currentProfile.bannerPath !== ""
    ) {
      setBannerPath(`${UPLOADS_PATH}${currentProfile.bannerPath}`);
    } else {
      setBannerPath("/add_banner.png");
    }
  }, [currentProfile]);

  useEffect(() => {
    if (profile?.id === profileId) {
      setIsOwnProfile(true);
      setCurrentProfile(profile);
    } else {
      fetchProfile();
    }
    fetchMasterclasses();
    fetchFreelances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, profileId, profile]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${PROFILE_PATH}/${profileId}`);
      const data = await response.json();
      setCurrentProfile(data);
      setBannerPath(`${UPLOADS_PATH}${data.bannerPath}`);
      setPpPath(`${UPLOADS_PATH}${data.profilePicturePath}`);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  if (!currentProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile_main_div">
      <div className="banner">
        <div className="banner_img_div">
          <img className="banner_img" src={bannerPath} alt="" />
        </div>
        {isOwnProfile ? (
          <button
            onClick={handleBannerEditClick}
            className="banner_edit_button profile_edit_button"
          >
            <img src="/edit.svg" alt="" />
          </button>
        ) : (
          ""
        )}
      </div>
      <div className="profile_display">
        {!isOwnProfile ? (
          ""
        ) : (
          <Link className="edit_profile_button" to={`/publish/${profile?.id}`}>
            <img
              src="/art_track_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"
              alt=""
            />
            <span>Publish</span>
          </Link>
        )}
        <div className="profile_display--left">
          <div className="profile_picture_div">
            <img className="profile_picture" src={ppPath} alt="" />
            {isOwnProfile ? (
              <button
                onClick={handlePPEditClick}
                className="pp_edit_button profile_edit_button"
              >
                <img src="/edit.svg" alt="edit profile picture button icon" />
              </button>
            ) : (
              ""
            )}
          </div>
          <h2 className="profile_name">{currentProfile.firstname}</h2>
          <div className="profile_follow">
            <h5>
              <span>7</span> followers
              <span style={{ padding: "0px 5px" }}>·</span> <span>3 </span>
              following
            </h5>
          </div>
          <div className="profile_detail">
            <img
              style={{ display: "inline-block" }}
              src="/pin_drop_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
              alt="location icon"
            />
            {currentProfile.country}
          </div>
          {freelances.length > 0 ? (
            <div className="profile_detail profile_detail--freelance">
              <img width={24} height={24} src="/pin.svg" alt="pin icon" />
              Available as freelancer
            </div>
          ) : (
            ""
          )}
          {currentProfile.personalWebsite ? (
            <div className="profile_detail ">
              <img
                width={24}
                height={24}
                src="/captive_portal_24dp_666666_FILL0_wght400_GRAD0_opsz24.svg"
                alt="personal website icon"
              />
              <a
                className="profile_detail--website"
                target="_blank"
                href={currentProfile.personalWebsite}
              >
                {FormatUrl.toUser(currentProfile.personalWebsite)}
              </a>
            </div>
          ) : (
            ""
          )}
          {masterclasses.length > 0 ? (
            <div className="profile_detail">
              <img
                width={24}
                height={24}
                src="/school_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"
                alt="masterclass available icon"
              />
              Masterclass{masterclasses.length > 1 ? "es" : ""} available
            </div>
          ) : (
            ""
          )}
          <menu className="profile_connect_buttons">
            {isOwnProfile ? (
              ""
            ) : (
              <button className="follow">
                <img
                  src="/add_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
                  alt="follow button icon"
                />
                Follow
              </button>
            )}
            {isOwnProfile ? (
              ""
            ) : (
              <button className="message">
                <img src="/donate.svg" alt="donate button icon" />
                Donate to artist
              </button>
            )}

            {isOwnProfile ? (
              ""
            ) : (
              <button className="message">
                <img
                  src="/mail_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
                  alt="send message button icon"
                />
                Message
              </button>
            )}

            {!isOwnProfile ? (
              ""
            ) : (
              <button
                onClick={() => setComponentState(CreateEvent)}
                className="message"
              >
                <img
                  src="/calendar_month_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
                  alt="new event button icon"
                />
                New Event
              </button>
            )}

            {!isOwnProfile ? (
              ""
            ) : (
              <button
                onClick={() => setComponentState(CreateMasterclass)}
                className="message"
              >
                <img
                  src="/school_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"
                  alt="new masterclass buttton icon"
                />
                New Masterclass
              </button>
            )}

            {!isOwnProfile ? (
              ""
            ) : (
              <button
                onClick={() => setComponentState(CreateFreelance)}
                className="message"
              >
                <img src="/pin.svg" alt="new freelance button icon" />
                Freelance
              </button>
            )}
          </menu>
        </div>
        <div className="profile_display--right">
          <ProfileDisplaySections setSection={setSection} />
          <div className="display_innercontainer">
            {section === "about" ? (
              <About />
            ) : section === "art" ? (
              <Art />
            ) : section === "collections" ? (
              <Collections />
            ) : section === "masterclasses" ? (
              <Masterclasses />
            ) : section === "events" ? (
              <Events />
            ) : section === "freelance" ? (
              <Freelances />
            ) : section === "liked" ? (
              <Liked />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
