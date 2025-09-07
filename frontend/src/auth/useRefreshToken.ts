import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const useRefreshToken = () => {
  const refresh = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/auth/refresh`, {
        withCredentials: true,
      });
      const newToken = response.data.accessToken;
      return newToken;
    } catch (err) {
      console.error("Refresh token failed:", err);
      return null;
    }
  };
  return refresh;
};

export default useRefreshToken;
