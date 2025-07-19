import { Link, useLocation } from "react-router-dom";
import Login from "./Login";
import { useAuthContext } from "../auth/AuthContext";
import { useModalContext } from "../context/ModalContext";
import { useEffect, useState } from "react";
import Signup from "./Signup";
import Sidebar from "./Sidebar";

export default function NavBar() {
  const location = useLocation();
  const { auth } = useAuthContext();
  const { Component, setComponentState } = useModalContext();
  const [isHomepage, setIsHomepage] = useState(true);

  useEffect(() => {
    setIsHomepage(location.pathname === "/");
  }, [location.pathname]);

  const toggleMenu = () => {
    if (Component === Sidebar) {
      setComponentState(undefined);
      return;
    } else {
      setComponentState(Sidebar, {});
    }
  };

  return (
    <div
      style={isHomepage ? { backgroundColor: "rgba(0,0,0,0)" } : {}}
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
              className="navBar_btn navBar_btn--login"
            >
              LOGIN
            </button>
            <button
              onClick={() => setComponentState(Signup)}
              className="navBar_btn navBar_btn--signup"
            >
              SIGNUP
            </button>
          </>
        ) : null}
        <Link className="navBar_nav" to="#">
          <img
            src="/diversity_3_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"
            alt=""
          />
          Community
        </Link>
        <Link className="navBar_nav" to="#">
          <img
            src="/wall_art_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"
            alt=""
          />
          Discover
        </Link>
        <Link className="navBar_nav" to="#">
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
        {auth ? (
          <Link className="publish_button" to="#">
            <img
              src="/art_track_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"
              alt=""
            />
            <span>Publish</span>
          </Link>
        ) : null}
        {auth ? (
          <Link className="navBar_nav" to="#">
            <img
              className="account_circle"
              src="/dev_files/painting-31.jpeg"
              alt=""
            />
          </Link>
        ) : null}
        <button onClick={toggleMenu} className="navBar_nav">
          <img
            src="/dehaze_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"
            alt=""
          />
          Menu
        </button>
      </div>
    </div>
  );
}
