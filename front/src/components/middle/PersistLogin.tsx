import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { LSTORAGE_KEY } from "config/constants";
import { useAppDispatch, useAppSelector } from "hooks/reduxDispatchAndSelector";
import { refresh } from "context/userSlice";

export const PersistLogin = () => {
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
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
          //el unico caso q en este momento se me ocurre, q no tengo "cubierto", es si el user logged in hace refresh, y no hay internet en el back, el error no pasa x el interceptor (x ser url==="/refresh") y va al errorHandler en donde simplemente despachamos error de 'no hay internet', y x ultimo, el ProtectedByAuth me va a  expulsar, pero no me loguea out, capaz tendria poner un erase user=true en el LSTORAGE no??, de todas maneras la cookie va a seguir vigente. Me puede causar un "hacker te hemos atrapado dsp??", xq si viene otro user y se loguea me va a mandar una cookie q no le pertenece, pensar bien dsp
          await dispatch(refresh());
        }
      } catch (error) {
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
