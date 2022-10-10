import { IUser } from "../models/User";

export default function getCleanUser(user: IUser) {
  const { __v, uid, refreshToken, ...rest } = user._doc;
  return rest;
}
