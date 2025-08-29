import { createContext, useContext, useEffect, useState } from "react";
// @ts-expect-error axios context usage
import useAxiosPrivate from "../auth/useAxiosPrivate";
import { useAuthContext } from "../auth/AuthContext";
import { defaultPreferences, type Preferences } from "../dto/Preferences";
import { useProfileContext } from "./ProfileContext";

// create preferences dto

const PREFERENCES_PATH = import.meta.env.VITE_USER_PREFERENCES_PATH;

interface PreferencesType {
  setPreference: (
    key: keyof Preferences,
    value: string | boolean | number
  ) => void;
  clearPreferences: () => void;
  preferences: Preferences | null;
}

const PreferencesContext = createContext<PreferencesType | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useUserPreferencesContext = (): PreferencesType => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error(
      "usePreferencesContext must be used within a PreferencesContextProvider"
    );
  }
  return context;
};

export const PreferencesContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuthContext();
  const { profile } = useProfileContext();
  const [settings, setSettings] = useState<Preferences | null>(null);

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!auth) return;
      try {
        const response = await axiosPrivate.get(
          `${PREFERENCES_PATH}/${auth.profileId}`
        );
        if (response.status === 200) {
          return response.data;
        }
      } catch (error) {
        console.error("Error fetching preferences:", error);
        return null;
      }
    };

    const initializePreferencesContext = async () => {
      if (!auth) {
        setSettings(defaultPreferences);
        return;
      }
      let storedSettings: Preferences | null = null;
      const storedData = localStorage.getItem("settings");
      if (storedData) storedSettings = JSON.parse(storedData);

      let finalSettings: Preferences = defaultPreferences;

      if (
        storedSettings &&
        profile &&
        storedSettings.profileId === profile.id
      ) {
        finalSettings = { ...storedSettings };
        if (
          !finalSettings.preferredCity ||
          finalSettings.preferredCity === ""
        ) {
          finalSettings.preferredCountry = profile.country;
        }
      } else {
        const fetchedPreferences = await fetchPreferences();
        if (fetchedPreferences) {
          finalSettings = { ...defaultPreferences, ...fetchedPreferences };
          if (profile) finalSettings.profileId = profile.id;
        } else {
          finalSettings = {
            ...defaultPreferences,
            preferredCountry: profile!.country,
          };
        }
      }
      setSettings(finalSettings);
    };

    initializePreferencesContext();
  }, [auth, profile]);

  const updatePreferences = (
    key: keyof Preferences,
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

  const clearPreferences = () => {
    localStorage.removeItem("settings");
    setSettings(null);
  };

  const value: PreferencesType = {
    preferences: settings,
    setPreference: updatePreferences,
    clearPreferences: clearPreferences,
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};
