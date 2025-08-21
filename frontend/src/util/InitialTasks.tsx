import { useDispatch } from "react-redux";
import CookiesConsent from "../components/CookiesConsent";
import { useUserPreferencesContext } from "../context/UserPreferencesContext";
import { addCountries } from "../store/locationSlice";

const COUNTRIES_PATH = import.meta.env.VITE_COUNTRIES_PATH;
const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function InitialTasks() {
  const dispatch = useDispatch();
  const fetchCountries = async (): Promise<void> => {
    try {
      const response = await fetch(`${BASE_URL}/${COUNTRIES_PATH}`);
      dispatch(addCountries(await response.json()));
    } catch (error) {
      console.error("Failed to fetch countries:", error);
    }
  };

  const { settings } = useUserPreferencesContext();
  fetchCountries();
  return settings?.cookieConsent ? null : <CookiesConsent />;
}
