import axiosPOSTLogin, { headerKey } from "API/axiosInstanceJWT";
import { BACKEND_URL } from "config/constants";
import { refresh } from "context/userSlice";
import { useRef } from "react";
import { useAppDispatch } from "./reduxDispatchAndSelector";

export const useInterceptor = () => {
  const dispatch = useAppDispatch();
  useRef(
    axiosPOSTLogin.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        /*  AbortController,antes hacia un simple return, y es como q no volvia al catch, iba al try y la cagaba */
        if (error?.message === "canceled") return Promise.reject(error);

        const previousRequest = error?.config;
        if (
          (error?.response?.status === 401 ||
            error?.response?.status === 403) &&
          !previousRequest?.sent &&
          error.config.url !== BACKEND_URL.REFRESH // necessary to avoid infinite loop in case of failed refresh. If there's an error during refresh, before going to the catch, axios interceptor will intervene and the .sent is undefined
        ) {
          console.log(
            previousRequest?.sent,
            666,
            "ver xq no es successful",
            888
          );
          previousRequest.sent = true;

          try {
            const data = await dispatch(refresh()).unwrap();
            console.log(data, "ACCESS TOKEN AFTER REFRESH");
            if (data?.accessToken) {
              previousRequest.headers[headerKey] = data.accessToken;
            }
            return axiosPOSTLogin(previousRequest);
          } catch (error) {
            console.log(error);
            console.log("errorDuringRefresh, we will log you out");
          }
        }
        /* si ponés return solo, sin Promise.reject(error), no pasa al catch, vuelve al try y vas a tener errores, x ej, destructurar data pensando q volvió la info biens */
        return Promise.reject(error);
      }
    )
  );

  return undefined;
};
