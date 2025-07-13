import axios from "axios";
import { createContext, useState, useContext, useEffect } from "react";

interface AuthState {
  userId: string;
  roles: number[];
  accessToken: string;
  profileId: string;
}

interface credentials {
  email: string;
  password: string;
}

type AuthContextType = {
  auth: AuthState | undefined;
  login: (credentials: credentials) => Promise<void>;
  logout: () => void;
  persist: boolean;
  setPersist: React.Dispatch<React.SetStateAction<boolean>>;
};

type AuthContextProviderProps = {
  children: React.ReactNode;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider"
    );
  }
  return context;
};

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [auth, setAuth] = useState<AuthState | undefined>(undefined);
  const [persist, setPersist] = useState<boolean>(() => {
    const persistedValue = localStorage.getItem("persist");
    return persistedValue !== null ? JSON.parse(persistedValue) : false;
  });

  const LOGIN_URL = import.meta.env.VITE_LOGIN_URL;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    if (auth) {
      setUserId(auth.userId);
    }
  }, [auth]);

  const login = async (credentials: credentials) => {
    try {
      const response = await axios.post(LOGIN_URL, credentials);
      setAuth({
        userId: response.data.userId,
        roles: [1000],
        accessToken: response.data.token,
        profileId: response.data.profileId,
      });
    } catch (error) {
      console.error("Login failed: ", error);
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/logout", {}, { withCredentials: true });
      setAuth(undefined);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const value: AuthContextType = {
    auth: auth,
    login,
    logout,
    persist,
    setPersist,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
