import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";

import { logout, renderError } from "./userSlice";

export default function handleError(
  error: any, //esto lo copié directamente del dispatch en userSlice
  dispatch: ThunkDispatch<unknown, unknown, AnyAction>
) {
  console.log(error?.config?.sent, "VER EL CONFIG");
  console.log(error?.response);
  console.log(JSON.stringify(error));

  //tengo q chequear si el error es por falta de internet, en ese caso loguearla out no sirve xq la cookie permanece, entonces tengo q informarle q no hay internet
  //NO HAY INTERNET
  if (
    error?.message === "Network Error" ||
    error?.message === "Failed to fetch"
  ) {
    return dispatch(renderError("No internet. "));
  }
  /* ABORT CONTROLLLER, no es tecnicamente un error, asi q simplemente devolvemos */
  if (error?.message === "canceled") return;

  if (error?.config?.sent && error?.response?.status === 403) {
    console.log("aca es un error pos-refresh-token api call", error.config);
    return dispatch(logout());
  }
  dispatch(
    renderError(
      error?.response?.data?.message ||
        error?.message ||
        "Something went wrong. "
    )
  );
}
