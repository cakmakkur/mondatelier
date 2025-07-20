import { useEffect, useRef } from "react";
import { useUserPreferencesContext } from "../context/UserPreferencesContext";

export default function CookiesConsent() {
  const { settings, updateUserPreferences } = useUserPreferencesContext();

  const cookiesConsentRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (!cookiesConsentRef.current) return;
    updateUserPreferences("cookieConsent", true);
  };

  useEffect(() => {
    if (!cookiesConsentRef.current) return;
    if (!settings?.cookieConsent) {
      cookiesConsentRef.current.style.transform = "translateY(-100px)";
    }
  }, [settings?.cookieConsent]);

  return (
    <div className="cookies_consent_div" ref={cookiesConsentRef}>
      <h2>Enable cookies?</h2>
      <button onClick={handleClick}>Enable</button>
    </div>
  );
}
