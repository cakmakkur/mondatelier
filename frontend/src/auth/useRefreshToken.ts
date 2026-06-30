import axios from "axios";
import { useCallback } from "react";
import { useAuthContext } from "./AuthContext";

const REFRESH_URL = import.meta.env.VITE_REFRESH_URL;

const useRefreshToken = () => {
  const { setAuth } = useAuthContext();

  return useCallback(async () => {
    try {
      const response = await axios.post(REFRESH_URL, {}, {
        withCredentials: true,
      });
      setAuth({
        accessToken: response.data.token,
        userId: response.data.userId,
        profileId: response.data.profileId,
      });
      return response.data.token as string;
    } catch (err) {
      console.error("Refresh token failed:", err);
      setAuth(undefined);
      return null;
    }
  }, [setAuth]);
};

export default useRefreshToken;
