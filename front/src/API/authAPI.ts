import loginAxiosInstance from "./loginAxiosInstance";
import { BACKEND_URL } from "config/constants";
import axiosInstanceJWT from "./axiosInstanceJWT";

import {
  createUserWithEmailAndPassword,
  deleteUser,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import { fireBaseAuth } from "services/firebaseConfig";

/*-------------------------LOGOUT-----------------------------*/

export const loginNode = function () {
  return axiosInstanceJWT.post<{ user: IUser }>(BACKEND_URL.LOGIN);
};
export const loginF = function (loginInput: ILoginInput) {
  return signInWithEmailAndPassword(
    fireBaseAuth,
    loginInput.email,
    loginInput.password
  );
};

export const registerNode = function (registerInput: IRegisterInput) {
  return axiosInstanceJWT.post<IUser>(BACKEND_URL.REGISTER, registerInput);
};
export const registerFireBase = function (registerInput: IRegisterInput) {
  return createUserWithEmailAndPassword(
    fireBaseAuth,
    registerInput.email,
    registerInput.password
  );
};

export const logout = function () {
  return signOut(fireBaseAuth);
};
export const forgotPwd = function (email: string) {
  fireBaseAuth.useDeviceLanguage();
  return sendPasswordResetEmail(fireBaseAuth, email);
};
export const updatePwdFirebase = function (newpwd: string) {
  if (fireBaseAuth.currentUser) {
    return updatePassword(fireBaseAuth.currentUser, newpwd);
  }
};
export const updateEmailFirebase = function (newEmail: string) {
  if (fireBaseAuth.currentUser) {
    return updateEmail(fireBaseAuth.currentUser, newEmail);
  }
};
export const updateUserNode = function (user: UserNotNull) {
  return axiosInstanceJWT.put<IUser>(BACKEND_URL.USERdyn(user?._id), user);
};

//este lo uso cuando falla mongo y ya cree firebase user
export const deleteProfile = function () {
  const user = fireBaseAuth.currentUser;
  if (user) return deleteUser(user);
};
