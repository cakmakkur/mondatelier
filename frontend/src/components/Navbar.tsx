import { use, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "./Modal";
import Login from "./Login";
import accountIcon from "../../public/account_box_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg";
import communityIcon from "../../public/diversity_3_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg";
import artworksIcon from "../../public/wall_art_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg";
import cartIcon from "../../public/shopping_cart_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg";
import menuIcon from "../../public/dehaze_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg";
import mailIcon from "../../public/mail_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg";
import { useAuthContext } from "../auth/AuthContext";

type Component = "login" | "signup";

export default function NavBar() {
  const { auth } = useAuthContext();
  const [renderModal, setRenderModal] = useState<Component | null>(null);

  const handleClick = (component: Component) => {
    setRenderModal(component);
  };

  return (
    <div className="navBar">
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
          <a className="navBar_nav" href="#">
            <img src={accountIcon} alt="" />
            Account
          </a>
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
        <a className="navBar_nav" href="#">
          <img src={communityIcon} alt="" />
          Community
        </a>
        <a className="navBar_nav" href="#">
          <img src={artworksIcon} alt="" />
          Artworks
        </a>
        <a className="navBar_nav" href="#">
          <img src={cartIcon} alt="" />
          Cart
        </a>
        {auth ? (
          <a className="navBar_nav" href="#">
            <img src={mailIcon} alt="" />
            Messages
          </a>
        ) : (
          ""
        )}
        <a className="navBar_nav" href="#">
          <img src={menuIcon} alt="" />
          Menu
        </a>
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
