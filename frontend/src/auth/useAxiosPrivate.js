import axios from "axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import { useAuthContext } from "./AuthContext";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuthContext();

  useEffect(() => {
    const requestInterceptor = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          if (auth?.accessToken) {
            config.headers["Authorization"] = `Bearer ${auth.accessToken}`;
          }
        }
        if (config.data instanceof FormData) {
          delete config.headers["Content-Type"];
        }
        return config;
      },
      (err) => Promise.reject(err)
    );

    const responseInterceptor = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (err) => {
        const prevRequest = err?.config;
        if (err?.response?.status === 401 && !prevRequest._retry) {
          prevRequest._retry = true;
          const newAccessToken = await refresh();
          if (newAccessToken) {
            prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return axiosPrivate(prevRequest);
          }
        }
        return Promise.reject(err);
      }
    );
    return () => {
      axiosPrivate.interceptors.response.eject(responseInterceptor);
      axiosPrivate.interceptors.request.eject(requestInterceptor);
    };
  }, [auth, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
