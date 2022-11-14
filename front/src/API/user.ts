import { BACKEND_URL } from "config/constants";
import axiosInstanceJWT from "./axiosInstanceJWT";

export const uploadImage = function (img: FormData, user: UserNotNull) {
  return axiosInstanceJWT.post<IUser>(BACKEND_URL.UPLOADIMGdyn(user._id), img);
};
export const getSingleUserProfile = function (userID: string) {
  return axiosInstanceJWT.get<UserNotNull>(BACKEND_URL.USERdyn(userID));
};
