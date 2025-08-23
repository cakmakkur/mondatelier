import { useDispatch } from "react-redux";
import CookiesConsent from "../components/CookiesConsent";
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

  const checkCookieConsent = () => {
    const cookieConsent = localStorage.getItem("cookieConsent");
    return cookieConsent;
  };

  fetchCountries();
  return checkCookieConsent() ? null : <CookiesConsent />;
}
