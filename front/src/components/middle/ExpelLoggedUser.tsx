import { FRONTEND_ENDPOINTS } from "config/constants";
import { useAppSelector } from "hooks/reduxDispatchAndSelector";
import { useLocation, Navigate, Outlet } from "react-router-dom";

interface LocationState {
  from: {
    pathname: string;
  };
}
export const ExpelLoggedUser = () => {
  const { user } = useAppSelector((state) => state.user);
  const location = useLocation();
  const state = location.state as LocationState;
  const goBack = state?.from?.pathname || FRONTEND_ENDPOINTS.HOME;
  return user ? <Navigate to={goBack}></Navigate> : <Outlet></Outlet>;
};
