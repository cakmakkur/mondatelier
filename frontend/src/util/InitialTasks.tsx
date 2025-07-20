import CookiesConsent from "../components/CookiesConsent";
import { useUserPreferencesContext } from "../context/UserPreferencesContext";

export default function InitialTasks() {
  const { settings } = useUserPreferencesContext();

  return settings?.cookieConsent ? null : <CookiesConsent />;
}
