import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import ForbiddenPage from "../pages/error/ForbiddenPage.jsx";
import {
  AUTH_STORAGE_EVENT,
  getStoredAccessToken,
  getStoredAuthUser,
  getStoredRefreshToken,
} from "../api/authStorage";

const RoleGuard = ({ allowedRole }) => {
  const location = useLocation();
  const [authUser, setAuthUser] = useState(() => getStoredAuthUser());

  useEffect(() => {
    const syncAuthUser = () => {
      setAuthUser(getStoredAuthUser());
    };

    window.addEventListener(AUTH_STORAGE_EVENT, syncAuthUser);
    window.addEventListener("storage", syncAuthUser);

    return () => {
      window.removeEventListener(AUTH_STORAGE_EVENT, syncAuthUser);
      window.removeEventListener("storage", syncAuthUser);
    };
  }, []);

  if (!authUser || (!getStoredAccessToken() && !getStoredRefreshToken())) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/articket/login?redirect=${redirect}`} replace />;
  }

  if (authUser.memberType !== allowedRole) {
    return <ForbiddenPage />;
  }

  return <Outlet />;
};

export default RoleGuard;