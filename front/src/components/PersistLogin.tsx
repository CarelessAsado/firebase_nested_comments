import { useEffect, useState } from "react";
import * as authAPI from "API/authAPI";
import { Outlet } from "react-router-dom";
import { useTareasGlobalContext } from "hooks/useTareasGlobalContext";
import { LSTORAGE_KEY } from "config/constants";
import setHeaders_User_LStorage from "config/utils/setHeadersAndUsers";

export const PersistLogin = () => {
  const { user, dispatch } = useTareasGlobalContext();
  console.log("estamos en user PERSIST", !!user);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    async function checkStorage() {
      console.log(
        "aca solo entramos si el status del user es false, hay user?: ",
        !!user
      );
      try {
        const storage = localStorage.getItem(LSTORAGE_KEY);
        console.log(storage, "ver q este todo bien con LSTORAGE_KEY");
        if (storage && JSON.parse(storage)) {
          //tengo q llamar al refresh y luego setear headers y user (o sea q tengo q enviar el user desde el back)
          const { data } = await authAPI.refresh();

          //setheaders and user
          setHeaders_User_LStorage(dispatch, data);
        }
      } catch (error) {
        //necesito abortar xq sino la doble request hace q hacker you have been caught

        // PROBLEMA: a. NO SE ESTA CANCELANDO, y hay un error en el backend, Promise not catched
        // b. al backend llegan 2 requests, es como q no anda el AbortController, y sin embargo, en Network figuran las dos reqs canceladas

        //PersistLogin
        //=>double render so CleanUP Fn where AbortControllers cancels
        //=> INTERCEPTOR => if message canceled devolvemos
        //=>al catch de PersistLogin y DSP????
        console.log(
          error,
          "esto deberia de ser dsp de devolver el error el interceptor"
        );
      } finally {
        setIsLoading(false);
      }
    }
    user ? setIsLoading(false) : checkStorage();
  }, [dispatch, user]);
  return isLoading ? <p>LOADING...</p> : <Outlet />;
};
