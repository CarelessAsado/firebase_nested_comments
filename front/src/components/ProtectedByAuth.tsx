import React from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useTareasGlobalContext } from "hooks/useTareasGlobalContext";
import { FRONTEND_ENDPOINTS } from "config/constants";

export const ProtectedByAuth = () => {
  const { user } = useTareasGlobalContext();
  const location = useLocation();
  return user ? (
    <Outlet></Outlet>
  ) : (
    <Navigate
      to={FRONTEND_ENDPOINTS.LOGIN}
      state={{ from: location }}
      replace
    ></Navigate>
  );
};
