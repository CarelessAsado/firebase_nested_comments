import React from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { FRONTEND_ENDPOINTS } from "config/constants";
import { useAppSelector } from "hooks/reduxDispatchAndSelector";

export const ProtectedByAuth = () => {
  const { user } = useAppSelector((state) => state.user);
  const location = useLocation();
  console.log("PROTECTED BY AUTH", 2, user);
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
