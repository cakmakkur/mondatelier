import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useModalContext } from "../../context/ModalContext";
import { useAuthContext } from "../../auth/AuthContext";

export default function Sidebar() {
  const sidebarDivRef = useRef<HTMLDivElement>(null);
  const playDotRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);
  const { Component, setComponentState } = useModalContext();
  const { auth, logout } = useAuthContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (Component === Sidebar) {
      setSidebarOpen(true);
    } else {
      setSidebarOpen(false);
    }
  }, [Component]);

  /*
   * Toggles animation of the flashing red record icon in Live-Streams tab
   */
  useEffect(() => {
    if (!playDotRef.current) return;

    intervalRef.current = setInterval(() => {
      playDotRef.current?.classList.toggle("stream_dot_flash");
    }, 1200);
    return () => {
      clearInterval(intervalRef.current!);
    };
  }, []);

  /*
   * Overlay Div is a modal, that overlies the visible part of
   * the sidebar when it is closed.
   * This stops click propagation to onderlying <a> elements
   * stopping navigation, instead triggering opening of sidebar
   */
  useEffect(() => {
    if (!sidebarDivRef.current) return;
    if (sidebarOpen) {
      sidebarDivRef.current.classList.add("sidebar_overlay--closed");
    } else {
      sidebarDivRef.current.classList.remove("sidebar_overlay--closed");
    }
  }, [sidebarOpen]);

  return (
    <div className={`sidebar ${sidebarOpen ? "sidebar_open" : ""}`}>
      <div
        ref={sidebarDivRef}
        onClick={(e) => {
          setComponentState(Sidebar);
          e.stopPropagation();
        }}
        className="sidebar_overlay"
        title="Open Sidebar"
      ></div>

      <nav>
        <ul className="sidebar_list">
          <li>
            <Link
              onClick={() => setComponentState(undefined)}
              className="sidebar_option"
              to="/cart"
            >
              <img
                src="/shopping_cart_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"
                alt=""
              />
              Cart
            </Link>
          </li>
          <li>
            <Link
              onClick={() => setComponentState(undefined)}
              className="sidebar_option"
              to="/comunity"
            >
              <img
                src="/diversity_3_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"
                alt=""
              />
              Community
            </Link>
          </li>
          <li>
            <Link
              onClick={() => setComponentState(undefined)}
              className="sidebar_option"
              to="/events"
            >
              <img
                src="/calendar_month_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"
                alt=""
              />
              Events
            </Link>
          </li>
          <li>
            <Link
              onClick={() => setComponentState(undefined)}
              className="sidebar_option"
              to="/masterclasses"
            >
              <img
                src="/school_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"
                alt=""
              />
              Masterclasses
            </Link>
          </li>
          <li>
            <Link
              onClick={() => setComponentState(undefined)}
              className="sidebar_option"
              to="/discover"
            >
              <img
                src="/wall_art_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"
                alt=""
              />
              Discover
            </Link>
          </li>
          <li>
            <Link
              onClick={() => setComponentState(undefined)}
              className="sidebar_option"
              to="/digital"
            >
              <img
                src="/handshake_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"
                alt=""
              />
              Collaborate
            </Link>
          </li>
          <li>
            <Link
              onClick={() => setComponentState(undefined)}
              className="sidebar_option"
              to="/digital"
            >
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
            <Link
              onClick={() => setComponentState(undefined)}
              className="sidebar_option"
              to="/digital"
            >
              <img
                src="/art_track_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"
                alt=""
              />
              <span style={{ color: "rgb(196, 0, 0)" }}>Publish</span>
            </Link>
          </li>
          {auth ? (
            <li>
              <Link
                onClick={() => setComponentState(undefined)}
                className="sidebar_option"
                to={auth.profileId ? `/profile/${auth.profileId}` : "/"}
              >
                <img
                  src="/account_box_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"
                  alt=""
                />
                Profile
              </Link>
            </li>
          ) : null}
          <li>
            <Link
              onClick={() => setComponentState(undefined)}
              className="sidebar_option"
              to="/preferences"
            >
              <img
                src="/settings_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"
                alt=""
              />
              Preferences
            </Link>
          </li>
          <li>
            <Link className="sidebar_option" to="/digital">
              🇬🇧 <span>Language</span>
            </Link>
          </li>
          {auth ? (
            <li>
              <Link
                onClick={() => {
                  setComponentState(undefined);
                  logout();
                }}
                className="sidebar_option"
                to="/"
              >
                {sidebarOpen ? "Logout" : "Lo.."}
              </Link>
            </li>
          ) : null}
        </ul>
      </nav>
      <span className="sidebar_separator"></span>

      <nav className="sidebar_lastnav">
        <ul>
          <li>
            <Link
              onClick={() => setComponentState(undefined)}
              className="sidebar_option"
              to="/help"
            >
              {Component === Sidebar ? "Help" : "Hel.."}
            </Link>
          </li>
          <li>
            <Link
              onClick={() => setComponentState(undefined)}
              className="sidebar_option"
              to="/contact"
            >
              {Component === Sidebar ? "Contact us" : "Con.."}
            </Link>
          </li>
          <li>
            <Link
              onClick={() => setComponentState(undefined)}
              className="sidebar_option"
              to="/impressum"
            >
              {Component === Sidebar ? "Impressum" : "Imp.."}
            </Link>
          </li>
          <li>
            <Link
              onClick={() => setComponentState(undefined)}
              className="sidebar_option"
              to="/termsandconditions"
            >
              {Component === Sidebar ? "Terms and Conditions" : "Ter.."}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
