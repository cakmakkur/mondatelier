import { useEffect, useRef } from "react";
import { useCookieContext } from "../context/CookiesContext";

export default function CookiesConsent() {
  const { isEnabled, setIsEnabled, updateCookies } = useCookieContext();

  const cookiesConsentRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (!cookiesConsentRef.current) return;
    cookiesConsentRef.current.style.transform = "translateY(100px)";
    setTimeout(() => {
      updateCookies(["isEnabled=true"], "/");
      setIsEnabled(true);
    }, 500);
  };

  useEffect(() => {
    if (!cookiesConsentRef.current) return;
    if (!isEnabled) {
      cookiesConsentRef.current.style.transform = "translateY(-100px)";
    }
  }, [isEnabled]);

  return (
    <div className="cookies_consent_div" ref={cookiesConsentRef}>
      <h2>Enable cookies?</h2>
      <button onClick={handleClick}>Enable</button>
    </div>
  );
}
