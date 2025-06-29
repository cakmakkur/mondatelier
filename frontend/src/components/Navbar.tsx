import { Link, useLocation } from "react-router-dom";
import Modal from "./Modal";
import Login from "./Login";
import { useAuthContext } from "../auth/AuthContext";
import { useModalContext } from "../context/ModalContext";
import { useEffect, useState } from "react";

type Component = "login" | "signup";

interface NavBarProps {
  setIsSidebarOpen?: (isOpen: boolean) => void;
  isSidebarOpen: boolean;
}

export default function NavBar({
  setIsSidebarOpen,
  isSidebarOpen,
}: NavBarProps) {
  const location = useLocation();
  const { auth } = useAuthContext();
  const { renderModal, setRenderModal } = useModalContext();
  const [isHomepage, setIsHomepage] = useState(true);

  useEffect(() => {
    setIsHomepage(location.pathname === "/");
  }, [location.pathname]);

  const handleClick = (component: Component) => {
    setRenderModal(component);
  };

  const toggleMenu = () => {
    if (setIsSidebarOpen) {
      setIsSidebarOpen(!isSidebarOpen);
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
          <a className="navBar_nav navBar__title" href="#">
            mondatelier
          </a>
        </Link>
      </div>
      <div className="navBar__right">
        {!auth ? (
          <>
            <button
              onClick={() => handleClick("login")}
              className="navBar_btn navBar_btn--login"
            >
              LOGIN
            </button>
            <button
              onClick={() => handleClick("login")}
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
      {renderModal === "login" ? (
        <Modal setRenderModal={setRenderModal}>
          <Login />
        </Modal>
      ) : renderModal === "signup" ? (
        <Modal setRenderModal={setRenderModal}>signup</Modal>
      ) : null}
    </div>
  );
}
