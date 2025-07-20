import axios, { type AxiosResponse } from "axios";
import { createContext, useState, useContext, useEffect } from "react";
import type { SignupDto } from "../dto/Signup";
import type { LoginDto } from "../dto/Login";

interface AuthState {
  userId: string;
  roles: number[];
  accessToken: string;
  profileId: string;
}

type AuthContextType = {
  auth: AuthState | undefined;
  login: (
    credentials: SignupDto
  ) => Promise<AxiosResponse<unknown, unknown> | undefined>;
  logout: () => void;
  signup: (
    credentials: SignupDto
  ) => Promise<AxiosResponse<unknown, unknown> | undefined>;
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

  const login = async (
    credentials: LoginDto
  ): Promise<AxiosResponse<unknown, unknown> | undefined> => {
    const controller = new AbortController();
    setAuth(undefined);
    const timeout = setTimeout(() => {
      controller.abort();
    }, 10000);

    try {
      const response = await axios.post(LOGIN_URL, credentials, {
        signal: controller.signal,
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        clearTimeout(timeout);
        setAuth({
          userId: response.data.userId,
          roles: [1000],
          accessToken: response.data.token,
          profileId: response.data.profileId,
        });
      }
      return response;
    } catch (error) {
      console.error("Login failed: ", error);
      clearTimeout(timeout);
      return;
    }
  };

  const signup = async (
    credentials: SignupDto
  ): Promise<AxiosResponse<unknown, unknown> | undefined> => {
    const controller = new AbortController();
    setAuth(undefined);
    const timeout = setTimeout(() => {
      controller.abort();
    }, 10000);
    try {
      const response = await axios.post("/auth/signup", credentials, {
        signal: controller.signal,
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        clearTimeout(timeout);
        setAuth({
          userId: response.data.userId,
          roles: [1000],
          accessToken: response.data.token,
          profileId: response.data.profileId,
        });
      }
      return response;
    } catch (error) {
      console.error("Signup failed: ", error);
      clearTimeout(timeout);
      return;
    }
  };

  const logout = () => {
    try {
      axios.post("/api/logout", {}, { withCredentials: true });
      setAuth(undefined);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const value: AuthContextType = {
    auth,
    login,
    logout,
    signup,
    persist,
    setPersist,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
