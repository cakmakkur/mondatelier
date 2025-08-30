import { createContext, useContext, useEffect, useRef, useState } from "react";
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

  const alreadyFetchedFor = useRef("");

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.status === 404) return null;
        console.error("Error fetching preferences:", error);
        return null;
      }
    };
    /**
     * Initialize the preferences context state.
     *
     * If the user is not logged in, the state is set to the default preferences.
     * If the user is logged in, the state is set to the stored preferences in local storage,
     * if they exist. If the stored preferences do not exist, or if the stored
     * preferences are outdated, the state is set to the fetched preferences from the server.
     * If the fetched preferences do not exist, the state is set to the default preferences.
     *
     * If the user has a profile, and the stored preferences do not have a preferred city,
     * the preferred city is set to the user's country.
     */

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
        if (alreadyFetchedFor.current === auth.profileId) return;
        const fetchedPreferences = await fetchPreferences();
        alreadyFetchedFor.current = auth.profileId;

        if (fetchedPreferences) {
          finalSettings = { ...defaultPreferences, ...fetchedPreferences };
          if (profile) finalSettings.profileId = profile.id;
        } else {
          if (profile) {
            finalSettings = {
              ...defaultPreferences,
              preferredCountry: profile!.country,
            };
          }
        }
      }
      setSettings(finalSettings);
    };

    initializePreferencesContext();
  }, [profile]);

  const updatePreferences = async (
    key: keyof Preferences,
    value: string | boolean | number
  ) => {
    if (!settings) return; // ignore if settings not loaded yet
    if (!Object.keys(defaultPreferences).includes(key)) return;

    const newSettings = {
      ...settings,
      [key]: value,
      profileId: auth?.profileId || "",
    };

    setSettings(newSettings);

    if (auth) {
      try {
        await axiosPrivate.post(
          `${PREFERENCES_PATH}/${auth?.profileId}`,
          newSettings
        );
      } catch (error) {
        console.log(error);
      }
    }
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
