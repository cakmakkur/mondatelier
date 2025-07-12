import { useCookieContext } from "../context/CookiesContext";
import CookiesConsent from "../components/CookiesConsent";

export default function InitialTasks() {
  const { isEnabled } = useCookieContext();

  return isEnabled ? null : <CookiesConsent />;
}
