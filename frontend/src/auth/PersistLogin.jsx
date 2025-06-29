import { useState, useEffect } from "react";
import { useAuthContext } from "../global_variables/AuthContext";
import useRefreshToken from "./useRefreshToken";
import { Outlet } from "react-router-dom";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth, persist } = useAuthContext();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    console.log(auth?.accessToken);
    auth?.accessToken ? setIsLoading(false) : verifyRefreshToken();
  }, []);

  return (
    <>{!persist ? <Outlet /> : isLoading ? <h1>Loading...</h1> : <Outlet />}</>
  );
};

export default PersistLogin;
