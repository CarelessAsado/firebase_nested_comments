import loginAxiosInstance from "./loginAxiosInstance";
import { BACKEND_URL } from "config/constants";
import axiosInstanceJWT from "./axiosInstanceJWT";

/*-------------------------LOGOUT-----------------------------*/

export const login = function (loginInput: ILoginInput) {
  return loginAxiosInstance.post<LoginSuccessful>(
    BACKEND_URL.LOGIN,
    loginInput
  );
};

export const register = function (registerInput: IRegisterInput) {
  return loginAxiosInstance.post(BACKEND_URL.REGISTER, registerInput);
};

export const logout = function () {
  return axiosInstanceJWT.get<void>(BACKEND_URL.LOGOUT);
};

export const refresh = function () {
  return axiosInstanceJWT.get<LoginSuccessful>(BACKEND_URL.REFRESH);
};
