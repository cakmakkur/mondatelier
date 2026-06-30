import { useEffect } from "react";
import { useDispatch } from "react-redux";
import CookiesConsent from "../components/CookiesConsent";
import { addCountries } from "../store/locationSlice";

const COUNTRIES_PATH = import.meta.env.VITE_COUNTRIES_PATH;
let countriesRequest: Promise<string[]> | undefined;

const loadCountries = () => {
  countriesRequest ??= fetch(COUNTRIES_PATH).then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to fetch countries (${response.status})`);
    }
    return response.json();
  });
  return countriesRequest;
};

export default function InitialTasks() {
  const dispatch = useDispatch();

  const checkCookieConsent = () => {
    const cookieConsent = localStorage.getItem("cookieConsent");
    return cookieConsent;
  };

  useEffect(() => {
    const fetchCountries = async (): Promise<void> => {
      try {
        dispatch(addCountries(await loadCountries()));
      } catch (error) {
        console.error("Failed to fetch countries:", error);
        countriesRequest = undefined;
      }
    };

    void fetchCountries();
  }, [dispatch]);

  return checkCookieConsent() ? null : <CookiesConsent />;
}
