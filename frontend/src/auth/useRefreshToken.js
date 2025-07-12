import { useAuthContext } from "./AuthContext";

const REFRESH = import.meta.env.VITE_URL_REFRESH;

const useRefreshToken = () => {
  const { setAuth } = useAuthContext();

  const reqOptions = {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };

  const refresh = async () => {
    const response = await fetch(REFRESH, reqOptions);
    const data = await response.json();
    setAuth({ ...auth, accessToken: data.token });
    return data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
