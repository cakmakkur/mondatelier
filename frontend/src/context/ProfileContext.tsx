import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "../auth/AuthContext";
import type { Profile } from "../dto/Profile";

interface ProfileContextType {
  profile: Profile | null;
  setProfile: (profile: Profile) => void;
}

const BASE_URL = import.meta.env.VITE_BASE_URL;
const PROFILE_PATH = import.meta.env.VITE_PROFILE_PATH;

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useProfileContext = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error(
      "useCookieContext must be used within a CookieContextProvider"
    );
  }
  return context;
};

export const ProfileContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const { auth } = useAuthContext();

  useEffect(() => {
    if (auth?.profileId) {
      fetch(`${BASE_URL}/${PROFILE_PATH}/${auth?.profileId}`)
        .then((response) => response.json())
        .then((data) => {
          setProfile(data);
        })
        .catch((error) => {
          console.error("Error fetching profile:", error);
        });
    }
  }, [auth]);

  const value = {
    profile,
    setProfile,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};
