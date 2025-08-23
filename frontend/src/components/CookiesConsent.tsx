import { useEffect, useRef } from "react";

export default function CookiesConsent() {
  const popupDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!popupDivRef.current) return;
    const cookieConsent = localStorage.getItem("cookieConsent");

    if (cookieConsent !== "true") {
      popupDivRef.current.classList.add("cookies_consent_div--open");
    }
  }, []);

  const handleClick = (b: boolean) => {
    localStorage.setItem("cookieConsent", b.toString());
    popupDivRef.current?.classList.remove("cookies_consent_div--open");
    popupDivRef.current?.classList.add("cookies_consent_div--closed");
  };

  return (
    <div className="cookies_consent_div" ref={popupDivRef}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {" "}
        <img className="cookies_consent_img" src="/cookie.svg" alt="" />
        <div>
          <h2 className="cookies_consent_header">We value your privacy</h2>
          <p>
            We use cookies to improve your experience, analyze site traffic, and
            personalize content. You can choose to accept all cookies or manage
            your preferences.
          </p>
        </div>
      </div>
      <div className="cookies_consent_div__buttons">
        <button onClick={() => handleClick(false)}>
          Accept only necessary cookies
        </button>

        <button onClick={() => handleClick(true)}>Accept all cookies</button>
      </div>
    </div>
  );
}
