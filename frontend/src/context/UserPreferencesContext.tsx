import { createContext, useContext, useEffect, useState } from "react";
// @ts-expect-error axios context usage
import useAxiosPrivate from "../auth/useAxiosPrivate";
import { useAuthContext } from "../auth/AuthContext";
import type { Settings } from "../dto/Settings";
import { defaultSettings } from "../dto/Settings";
import { useProfileContext } from "./ProfileContext";

const USER_PREFERENCES_PATH = import.meta.env.VITE_USER_PREFERENCES_PATH;
const BASE_URL = import.meta.env.VITE_BASE_URL;

interface UserPreferencesType {
  updateUserPreferences: (
    key: keyof Settings,
    value: string | boolean | number
  ) => void;
  clearUserPreferences: () => void;
  settings: Settings | null;
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
  const { profile } = useProfileContext();
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    const fetchUserSettings = async () => {
      if (!auth) return;
      try {
        const response = await axiosPrivate.get(
          `${BASE_URL}/${USER_PREFERENCES_PATH}/${auth.userId}`
        );
        if (response.status === 200) {
          return response.data;
        }
      } catch (error) {
        console.error("Error fetching user settings:", error);
        return null;
      }
    };

    const initializeUserPreferencesContext = async () => {
      if (!auth) {
        setSettings(defaultSettings);
        return;
      }

      let storedSettings: Settings | null = null;
      const storedData = localStorage.getItem("settings");
      if (storedData) storedSettings = JSON.parse(storedData);

      let finalSettings: Settings = defaultSettings;

      if (
        storedSettings &&
        profile &&
        storedSettings.profileId === profile.id
      ) {
        finalSettings = { ...storedSettings };
        if (
          !finalSettings.eventPreferredCity ||
          finalSettings.eventPreferredCity === ""
        ) {
          finalSettings.eventPreferredCountry = profile.country;
        }
      } else {
        const userSettings = await fetchUserSettings();
        if (userSettings) {
          finalSettings = { ...defaultSettings, ...userSettings };
          if (profile) finalSettings.profileId = profile.id;
        } else {
          finalSettings = {
            ...defaultSettings,
            eventPreferredCountry: profile!.country,
          };
        }
      }

      setSettings(finalSettings);
    };

    initializeUserPreferencesContext();
  }, [auth, profile]);

  const updateUserPreferences = (
    key: keyof Settings,
    value: string | boolean | number
  ) => {
    setSettings((prevSettings) => {
      if (!prevSettings) return prevSettings;
      if (prevSettings[key] === value) return prevSettings;
      return { ...prevSettings, [key]: value };
    });
  };

  useEffect(() => {
    if (!settings) return;
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  const clearUserPreferences = () => {
    localStorage.removeItem("settings");
    setSettings(null);
  };

  const value: UserPreferencesType = {
    settings,
    updateUserPreferences,
    clearUserPreferences,
  };

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
};
