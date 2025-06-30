import { useState } from "react";
import About from "../components/profile/About";
import Art from "../components/profile/Art";
import Collections from "../components/profile/Collections";
import Follow from "../components/profile/Follow";
import ProfileDisplaySections from "../components/profile/ProfileDisplaySections";

export default function Profile() {
  const [section, setSection] = useState<string>("about");

  return (
    <div className="profile_main_div">
      <div className="banner">
        <div className="banner_img_div">
          <img src="../../public/dev_files/painting-18.jpeg" alt="" />
        </div>
        <img
          className="profile_picture"
          src="../../public/dev_files/painting-31.jpeg"
          alt=""
        />
      </div>
      <div className="profile_display">
        <div className="profile_display--left">
          <h2 className="profile_name">Kürsat Cakmak</h2>
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
              src="../../public/pin_drop_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
              alt=""
            />
            Austria
          </div>
          <div className="profile_detail">
            <img
              src="../../public/handshake_24dp_666666_FILL0_wght400_GRAD0_opsz24.svg"
              alt=""
            />
            Available as freelancer
          </div>
          <div className="profile_detail">
            <img
              src="../../public/captive_portal_24dp_666666_FILL0_wght400_GRAD0_opsz24.svg"
              alt=""
            />
            www.cakmakkursat.com
          </div>
          <div className="profile_detail">
            <img
              src="../../public/school_24dp_666666_FILL0_wght400_GRAD0_opsz24.svg"
              alt=""
            />
            Masterclasses available
          </div>
          <div className="profile_connect_buttons">
            <button className="follow">
              <img
                src="../../public/add_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
                alt=""
              />
              Follow
            </button>
            <button className="message">
              <img
                src="../../public/mail_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
                alt=""
              />
              Message
            </button>
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
            ) : section === "followers" ? (
              <Follow followType="followers" />
            ) : section === "following" ? (
              <Follow followType="following" />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
