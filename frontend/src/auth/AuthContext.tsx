import axios, { type AxiosResponse } from "axios";
import { createContext, useState, useContext, useEffect } from "react";
import type { SignupDto } from "../dto/Signup";
import type { LoginDto } from "../dto/Login";

interface AuthState {
  userId: string;
  accessToken: string;
  profileId: string;
}

type AuthContextType = {
  setAuth: React.Dispatch<React.SetStateAction<AuthState | undefined>>;
  auth: AuthState | undefined;
  login: (
    credentials: LoginDto
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
  const SIGNUP_URL = import.meta.env.VITE_SIGNUP_URL;
  const REFRESH_URL = import.meta.env.VITE_REFRESH_URL;
  const LOGOUT_URL = import.meta.env.VITE_LOGOUT_URL;

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
          accessToken: response.data.token,
          profileId: response.data.profileId,
        });
      }
      return response;
    } catch (error) {
      console.error("Login failed: ", error);
      setAuth(undefined);
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
      const response = await axios.post(SIGNUP_URL, credentials, {
        signal: controller.signal,
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        clearTimeout(timeout);
        login({ email: credentials.email, password: credentials.password });
      }
      return response;
    } catch (error) {
      console.error("Signup failed: ", error);
      clearTimeout(timeout);
      return;
    }
  };

  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const response = await axios.post(
          REFRESH_URL,
          {},
          { withCredentials: true }
        );
        if (response.status === 200) {
          setAuth({
            accessToken: response.data.token,
            userId: response.data.userId,
            profileId: response.data.profileId,
          });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        if (err.status === 401) return;
        console.error("Could not refresh token on mount:", err);
        setAuth(undefined);
      }
    };

    refreshAccessToken();
  }, []);

  const logout = async () => {
    try {
      await axios.post(LOGOUT_URL, {}, { withCredentials: true });
      setAuth(undefined);
      window.location.reload();
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
    setAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
