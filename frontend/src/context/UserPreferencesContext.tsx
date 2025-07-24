import { createContext, useContext, useEffect, useState } from "react";
// @ts-expect-error axios context usage
import useAxiosPrivate from "../auth/useAxiosPrivate";
import { useAuthContext } from "../auth/AuthContext";
import type { Settings } from "../dto/Settings";
import { defaultSettings } from "../dto/Settings";

const USER_PREFERENCES_PATH = import.meta.env.USER_PREFERENCES_PATH;
const BASE_URL = import.meta.env.BASE_URL;

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
      const storedData = localStorage.getItem("settings");

      if (storedData) {
        const localSettings: Settings = JSON.parse(storedData);
        if (auth) {
          if (localSettings.profileId === auth.profileId) {
            setSettings(localSettings);
            return;
          } else {
            // clearUserPreferences();
            // const userSettings = await fetchUserSettings();
            // if (userSettings)
            //   Object.keys(userSettings).forEach((key) => {
            //     updateUserPreferences(key, userSettings[key as keyof Settings]);
            //   });
            updateUserPreferences("profileId", auth.profileId);
          }
        } else {
          Object.keys(localSettings).forEach((key) => {
            updateUserPreferences(key, localSettings[key as keyof Settings]);
          });
        }
      } else if (auth) {
        const userSettings = await fetchUserSettings();
        if (userSettings) {
          Object.keys(userSettings).forEach((key) => {
            updateUserPreferences(key, userSettings[key as keyof Settings]);
          });
        }
      } else {
        setSettings(defaultSettings);
      }
    };
    initializeUserPreferencesContext();
  }, [auth]);

  const updateUserPreferences = (
    key: string,
    value: string | boolean | number
  ) => {
    setSettings((prevSettings) => {
      if (!prevSettings) return defaultSettings;

      if (prevSettings[key as keyof Settings] === value) {
        return prevSettings;
      } else {
        return { ...prevSettings, [key]: value };
      }
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
