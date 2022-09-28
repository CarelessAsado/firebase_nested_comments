import { resetError } from "context/userSlice";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { useAppDispatch } from "./reduxDispatchAndSelector";

export const useResetErrors = () => {
  const location = useLocation();

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(resetError());
  }, [dispatch, location?.pathname]);
  return undefined;
};
