import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = () => {
  return window.localStorage.getItem("access_token") ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoutes;
