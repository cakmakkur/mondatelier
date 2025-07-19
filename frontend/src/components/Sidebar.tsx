import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useModalContext } from "../context/ModalContext";

export default function Sidebar() {
  const sidebarDivRef = useRef<HTMLDivElement>(null);
  const playDotRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);
  const { Component } = useModalContext();

  useEffect(() => {
    if (!playDotRef.current) return;

    intervalRef.current = setInterval(() => {
      playDotRef.current?.classList.toggle("stream_dot_flash");
    }, 1200);
    return () => {
      clearInterval(intervalRef.current!);
    };
  }, []);

  return (
    <div
      ref={sidebarDivRef}
      className={`sidebar ${Component === Sidebar ? "sidebar_open" : ""}`}
    >
      <nav>
        <ul className="sidebar_list">
          <li>
            <Link className="sidebar_option" to="/artworks">
              <img
                src="/shopping_cart_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"
                alt=""
              />
              Cart
            </Link>
          </li>
          <li>
            <Link className="sidebar_option" to="/music">
              <img
                src="/diversity_3_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"
                alt=""
              />
              Community
            </Link>
          </li>
          <li>
            <Link className="sidebar_option" to="/digital">
              <img
                src="/calendar_month_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"
                alt=""
              />
              Events
            </Link>
          </li>
          <li>
            <Link className="sidebar_option" to="/digital">
              <img
                src="/school_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"
                alt=""
              />
              Masterclasses
            </Link>
          </li>
          <li>
            <Link className="sidebar_option" to="/digital">
              <img
                src="/wall_art_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"
                alt=""
              />
              Discover
            </Link>
          </li>
          <li>
            <Link className="sidebar_option" to="/digital">
              <img
                src="/handshake_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"
                alt=""
              />
              Collaborate
            </Link>
          </li>
          <li>
            <Link className="sidebar_option" to="/digital">
              <span
                ref={playDotRef}
                style={{
                  color: "red",
                  margin: "0px 10px",
                  transform: "scale(4) translateY(1px)",
                }}
              >
                &#183;
              </span>
              <span>Live Streams</span>
            </Link>
          </li>
        </ul>
      </nav>
      <span className="sidebar_separator"></span>
      <nav>
        <ul>
          <li>
            <Link className="sidebar_option" to="/digital">
              <img
                src="/art_track_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"
                alt=""
              />
              <span style={{ color: "red" }}>Publish</span>
            </Link>
          </li>
          <li>
            <Link className="sidebar_option" to="/digital">
              <img
                src="/account_box_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"
                alt=""
              />
              Profile
            </Link>
          </li>
          <li>
            <Link className="sidebar_option" to="/digital">
              <img
                src="/settings_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"
                alt=""
              />
              Preferences
            </Link>
          </li>
          <li>
            <Link className="sidebar_option" to="/digital">
              🇬🇧 Language
            </Link>
          </li>
          <li>
            <Link className="sidebar_option" to="/profile">
              Logout
            </Link>
          </li>
        </ul>
      </nav>
      <span className="sidebar_separator"></span>

      <nav className="sidebar_lastnav">
        <ul>
          <li>
            <Link className="sidebar_option" to="/3d">
              Help
            </Link>
          </li>
          <li>
            <Link className="sidebar_option" to="/collections">
              Contact us
            </Link>
          </li>
          <li>
            <Link className="sidebar_option" to="/community">
              Impressum
            </Link>
          </li>
          <li>
            <Link className="sidebar_option" to="/profile">
              Terms and Conditions
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
