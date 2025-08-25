import { useEffect, useState } from "react";
import About from "../components/profile/About";
import Art from "../components/profile/art/Art";
import Collections from "../components/profile/Collections";
import Follow from "../components/profile/Follow";
import ProfileDisplaySections from "../components/profile/ProfileDisplaySections";
import { useAuthContext } from "../auth/AuthContext";
import { useParams } from "react-router-dom";
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

const UPLOADS_PATH = import.meta.env.VITE_UPLOADS_URL;
const BASE_URL = import.meta.env.VITE_BASE_URL;
const PROFILE_PATH = import.meta.env.VITE_PROFILE_PATH;
const FREELANCE_PATH = import.meta.env.VITE_FREELANCE_PATH;
const MASTERCLASS_PATH = import.meta.env.VITE_MASTERCLASS_PATH;

export default function Profile() {
  const [section, setSection] = useState<string>("about");
  const { auth } = useAuthContext();
  const { profile } = useProfileContext();
  const [isOwnProfile, setIsOwnProfile] = useState<boolean>(false);
  const { profileId } = useParams();
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [freelances, setFreelances] = useState<Freelance[]>([]);
  const [masterclasses, setMasterclasses] = useState<Masterclass[]>([]);
  const [ppPath, setPpPath] = useState("/person.svg");
  const [bannerPath, setBannerPath] = useState("");
  const { setComponentState } = useModalContext();

  const fetchMasterclasses = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/${MASTERCLASS_PATH}?profileId=${profileId}`
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
      const response = await fetch(
        `${BASE_URL}/${FREELANCE_PATH}?profileId=${profileId}`
      );
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
      targetUrl: `${BASE_URL}/${PROFILE_PATH}/profilePicture/${profileId}`,
    });
  };

  const handleBannerEditClick = () => {
    setComponentState(ImageUploader, {
      targetUrl: `${BASE_URL}/${PROFILE_PATH}/bannerImage/${profileId}`,
    });
  };

  useEffect(() => {
    if (
      currentProfile &&
      currentProfile.profilePicturePath !== null &&
      currentProfile.profilePicturePath !== ""
    ) {
      setPpPath(`${UPLOADS_PATH}${profile?.profilePicturePath}`);
    } else {
      setPpPath("/person.svg");
    }
  }, [profile, currentProfile]);

  useEffect(() => {
    if (
      currentProfile &&
      currentProfile.bannerPath !== null &&
      currentProfile.bannerPath !== ""
    ) {
      setBannerPath(`${UPLOADS_PATH}${profile?.bannerPath}`);
    } else {
      setBannerPath("/add_banner.png");
    }
  }, [profile, currentProfile]);

  useEffect(() => {
    if (profile?.id === profileId) {
      setIsOwnProfile(true);
      if (profile) {
        setCurrentProfile(profile);
      } else {
        fetchProfile();
      }
    } else {
      fetchProfile();
    }
    fetchMasterclasses();
    fetchFreelances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, profileId]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${BASE_URL}/${PROFILE_PATH}/${profileId}`);
      const data = await response.json();
      setCurrentProfile(data);
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
          <img src={bannerPath} alt="" />
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
        <div className="profile_picture_div">
          <img className="profile_picture" src={ppPath} alt="" />
          {isOwnProfile ? (
            <button
              onClick={handlePPEditClick}
              className="pp_edit_button profile_edit_button"
            >
              <img src="/edit.svg" alt="" />
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="profile_display">
        {!isOwnProfile ? (
          ""
        ) : (
          <button className="edit_profile_button">
            <img src="/edit.svg" alt="" />
            Edit Profile
          </button>
        )}
        <div className="profile_display--left">
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
              alt=""
            />
            {currentProfile.country}
          </div>
          {freelances.length > 0 ? (
            <div className="profile_detail profile_detail--freelance">
              <img
                src="/handshake_24dp_666666_FILL0_wght400_GRAD0_opsz24.svg"
                alt=""
              />
              Available as freelancer
            </div>
          ) : (
            ""
          )}
          {currentProfile.personalWebsite ? (
            <div className="profile_detail ">
              <img
                src="/captive_portal_24dp_666666_FILL0_wght400_GRAD0_opsz24.svg"
                alt=""
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
                src="/school_24dp_666666_FILL0_wght400_GRAD0_opsz24.svg"
                alt=""
              />
              Masterclass{masterclasses.length > 1 ? "es" : ""} available
            </div>
          ) : (
            ""
          )}
          <div className="profile_connect_buttons">
            {isOwnProfile ? (
              ""
            ) : (
              <button className="follow">
                <img
                  src="/add_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
                  alt=""
                />
                Follow
              </button>
            )}
            {isOwnProfile ? (
              ""
            ) : (
              <button className="message">
                <img src="/donate.svg" alt="" />
                Donate to artist
              </button>
            )}

            {isOwnProfile ? (
              ""
            ) : (
              <button className="message">
                <img
                  src="/mail_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
                  alt=""
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
                  alt=""
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
                  src="/school_24dp_666666_FILL0_wght400_GRAD0_opsz24.svg"
                  alt=""
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
                <img
                  src="/handshake_24dp_666666_FILL0_wght400_GRAD0_opsz24.svg"
                  alt=""
                />
                Freelance
              </button>
            )}
          </div>
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
            ) : section === "followers" ? (
              <Follow followType="followers" />
            ) : section === "following" ? (
              <Follow followType="following" />
            ) : section === "liked" ? (
              <Liked />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
