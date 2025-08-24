import { Link, useLocation } from "react-router-dom";
import Login from "../auth/Login";
import { useAuthContext } from "../../auth/AuthContext";
import { useModalContext } from "../../context/ModalContext";
import { useEffect, useState } from "react";
import Signup from "../auth/Signup";
import Sidebar from "./Sidebar";
import { useProfileContext } from "../../context/ProfileContext";

const UPLOADS_PATH = import.meta.env.VITE_UPLOADS_URL;

export default function NavBar() {
  // const location = useLocation();
  const { auth } = useAuthContext();
  const { Component, setComponentState } = useModalContext();
  const [isTransparent, setIsTransparent] = useState(false);
  const { profile } = useProfileContext();
  const [ppPath, setPpPath] = useState("/person.svg");

  // useEffect(() => {
  //   setIsTransparent(location.pathname !== "/");
  // }, [location.pathname]);

  const toggleMenu = () => {
    if (Component === Sidebar) {
      setComponentState(undefined);
      return;
    } else {
      // seems to be working, check if this is the right way to do it
      setComponentState(Sidebar, {});
    }
  };

  useEffect(() => {
    if (profile?.profilePicturePath) {
      setPpPath(UPLOADS_PATH + profile.profilePicturePath);
    }
  }, [profile]);

  return (
    <div
      style={isTransparent ? { backgroundColor: "rgba(0,0,0,0)" } : {}}
      className="navBar"
    >
      <div className="navBar__left">
        <Link className="navBar__left" to="/">
          <img className="navBar__favicon" src="/favicon.png" alt="" />
          <span className="navBar_nav navBar__title">mondatelier</span>
        </Link>
      </div>
      <div className="navBar__right">
        {!auth ? (
          <>
            <button
              onClick={() => setComponentState(Login)}
              className="default_btn navBar_btn--login"
            >
              LOGIN
            </button>
            <button
              onClick={() => setComponentState(Signup)}
              className="default_btn navBar_btn--signup"
            >
              SIGNUP
            </button>
          </>
        ) : null}
        <Link className="navBar_nav" to="/community">
          <img
            src="/diversity_3_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"
            alt=""
          />
          Community
        </Link>
        <Link className="navBar_nav" to="/discover">
          <img
            src="/wall_art_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"
            alt=""
          />
          Discover
        </Link>
        <Link className="navBar_nav" to="/events">
          <img
            src="/calendar_month_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"
            alt=""
          />
          Events
        </Link>
        {auth ? (
          <Link className="navBar_nav" to="#">
            <img
              src="/mail_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"
              alt=""
            />
            Messages
          </Link>
        ) : null}
        {auth && profile ? (
          <Link className="publish_button" to={`/publish/${profile.id}`}>
            <img
              src="/art_track_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"
              alt=""
            />
            <span>Publish</span>
          </Link>
        ) : null}
        {auth && profile ? (
          <Link className="navBar_nav" to={`/profile/${profile.id}`}>
            <img
              className="account_circle"
              src={ppPath}
              alt="profile picture of the user"
            />
          </Link>
        ) : null}
        <button onClick={toggleMenu} className="menu_button">
          <img
            src="/dehaze_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"
            alt=""
          />
        </button>
      </div>
    </div>
  );
}
