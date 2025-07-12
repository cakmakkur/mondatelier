import { createContext, useContext, useEffect, useState } from "react";
// @ts-expect-error axios context usage
import useAxiosPrivate from "../auth/useAxiosPrivate";
import { useAuthContext } from "../auth/AuthContext";
import { useCookieContext } from "./CookiesContext";
import { CookieType } from "../enums/CookieType";

const USER_PREFERENCES_PATH = import.meta.env.USER_PREFERENCES_PATH;
const BASE_URL = import.meta.env.BASE_URL;

interface UserPreferencesType {
  updateUserPreferences: (preferencesArr: string[]) => void;
}

const UserPreferencesContext = createContext<UserPreferencesType | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useUserPreferencesContext = (): UserPreferencesType => {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error(
      "useUserPreferencesContext must be used within a UserPreferencesContextProvider"
    );
  }
  return context;
};

export const UserPreferencesContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuthContext();
  const { updateCookies, isEnabled } = useCookieContext();

  const [theme, setTheme] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [eventPreferredLocation, setEventPreferredLocation] =
    useState<string>("");
  const [animations, setAnimations] = useState<boolean>(false);

  useEffect(() => {
    const initializeUserPreferencesContext = async () => {
      const cookies = Object.fromEntries(
        document.cookie.split("; ").map((c) => c.split("="))
      );

      if (Object.keys(cookies).length === 0 && auth) {
        try {
          const response = await axiosPrivate.get(
            `${BASE_URL}/${USER_PREFERENCES_PATH}/${auth.userId}`
          );
          if (response.status === 200) {
            const { theme, language, eventPreferredCity, animations } =
              response.data;
            if (theme && language && eventPreferredCity && animations) {
              updateUserPreferences([
                `${CookieType.THEME}=${theme}`,
                `${CookieType.LANGUAGE}=${language}`,
                `${CookieType.EVENT_PREFERRED_CITY}=${eventPreferredCity}`,
                `${CookieType.ANIMATIONS}=${animations}`,
              ]);
            }
          }
        } catch (error) {
          console.error("Can't initiate user preferences." + error);
        }
      }
    };
    initializeUserPreferencesContext();
  }, []);

  const updateUserPreferences = (preferencesArr: string[]) => {
    for (const preference of preferencesArr) {
      const [key, value] = preference.split("=");
      if (key === CookieType.THEME) {
        setTheme(value);
        if (isEnabled) {
          updateCookies([`${CookieType.THEME}=${value}`], "/");
        }
      } else if (key === CookieType.LANGUAGE) {
        setLanguage(value);
        if (isEnabled) {
          updateCookies([`${CookieType.LANGUAGE}=${value}`], "/");
        }
      } else if (key === CookieType.EVENT_PREFERRED_CITY) {
        setEventPreferredLocation(value);
        if (isEnabled) {
          updateCookies([`${CookieType.EVENT_PREFERRED_CITY}=${value}`], "/");
        }
      } else if (key === CookieType.ANIMATIONS) {
        setAnimations(value === "true");
        if (isEnabled) {
          updateCookies([`${CookieType.ANIMATIONS}=${value}`], "/");
        }
      }
    }
    console.log("User preferences updated");
    console.log("Theme:", theme);
    console.log("Language:", language);
    console.log("Event Preferred Location:", eventPreferredLocation);
    console.log("Animations:", animations);
  };

  const value: UserPreferencesType = {
    updateUserPreferences,
  };

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
};
