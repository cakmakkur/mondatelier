import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "/src/global_variables/AuthContext";

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuthContext();

  return auth?.roles?.find((role) => allowedRoles?.includes(role)) ? (
    <Outlet />
  ) : auth ? (
    "ACCESS DENIED"
  ) : (
    <Navigate to="/unauthorized" />
  );
};

export default RequireAuth;
