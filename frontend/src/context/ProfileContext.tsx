import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "../auth/AuthContext";
import type { Profile } from "../dto/Profile";

interface ProfileContextType {
  profile: Profile | undefined;
  setProfile: (profile: Profile) => void;
}

const PROFILE_PATH = import.meta.env.VITE_PROFILE_PATH;

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useProfileContext = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error(
      "useProfileContext must be used within a ProfileContextProvider"
    );
  }
  return context;
};

export const ProfileContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [profile, setProfile] = useState<Profile | undefined>(undefined);
  const { auth } = useAuthContext();

  useEffect(() => {
    if (!auth) {
      setProfile(undefined);
    } else if (auth.profileId) {
      fetch(`${PROFILE_PATH}/${auth?.profileId}`)
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
