import { useContext } from "react";
import { TareasContext } from "context/context";
export const useTareasGlobalContext = () => {
  return useContext(TareasContext);
};
