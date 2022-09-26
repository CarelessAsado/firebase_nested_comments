import { useEffect } from "react";
import { ActionsEnum } from "context/actions";
import { useTareasGlobalContext } from "./useTareasGlobalContext";

export const useResetErrors = () => {
  const { dispatch /* , error */ } = useTareasGlobalContext();
  useEffect(() => {
    function resetErrors() {
      dispatch({ type: ActionsEnum.RESET_ERRORS });
    }
    /*  error && */ resetErrors();
  }, [dispatch]);
  return undefined;
};
