import { useAuthContext } from "./AuthContext";

const REFRESH_URL = import.meta.env.VITE_REFRESH_URL;

const useRefreshToken = () => {
  const { setAuth } = useAuthContext();

  const refresh = async (): Promise<string | null> => {
    try {
      const response = await fetch(REFRESH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) throw new Error("Refresh failed");

      const data = await response.json();
      const newAccessToken = data.accessToken;

      setAuth((prev) =>
        prev ? { ...prev, accessToken: newAccessToken } : prev
      );

      return newAccessToken;
    } catch (err) {
      console.error("Refresh token error:", err);
      setAuth(undefined);
      return null;
    }
  };

  return refresh;
};

export default useRefreshToken;
