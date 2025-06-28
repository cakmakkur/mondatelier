import { Link } from "react-router-dom";

export default function NavBar() {
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
        <a className="navBar_nav" href="#">
          LOGIN
        </a>
        <a className="navBar_nav" href="#">
          SIGNUP
        </a>
        <a className="navBar_nav" href="#">
          Community
        </a>
        <a className="navBar_nav" href="#">
          Artworks
        </a>
        <a className="navBar_nav" href="#">
          Cart
        </a>
        <a className="navBar_nav" href="#">
          Menu
        </a>
      </div>
    </div>
  );
}
