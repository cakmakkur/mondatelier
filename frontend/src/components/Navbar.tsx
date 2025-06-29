import { Link, useLocation } from "react-router-dom";
import Modal from "./Modal";
import Login from "./Login";
import accountIcon from "../../public/account_box_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg";
import communityIcon from "../../public/diversity_3_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg";
import artworksIcon from "../../public/wall_art_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg";
import cartIcon from "../../public/shopping_cart_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg";
import menuIcon from "../../public/dehaze_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg";
import mailIcon from "../../public/mail_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg";
import { useAuthContext } from "../auth/AuthContext";
import { useModalContext } from "../context/ModalContext";
import { useEffect, useState } from "react";

type Component = "login" | "signup";

export default function NavBar() {
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
        {auth ? (
          <Link className="navBar_nav" to="/profile">
            <img src={accountIcon} alt="" />
            Account
          </Link>
        ) : (
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
        )}
        <Link className="navBar_nav" to="#">
          <img src={communityIcon} alt="" />
          Community
        </Link>
        <Link className="navBar_nav" to="#">
          <img src={artworksIcon} alt="" />
          Artworks
        </Link>
        <Link className="navBar_nav" to="#">
          <img src={cartIcon} alt="" />
          Cart
        </Link>
        {auth ? (
          <Link className="navBar_nav" to="#">
            <img src={mailIcon} alt="" />
            Messages
          </Link>
        ) : (
          ""
        )}
        <Link className="navBar_nav" to="#">
          <img src={menuIcon} alt="" />
          Menu
        </Link>
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
