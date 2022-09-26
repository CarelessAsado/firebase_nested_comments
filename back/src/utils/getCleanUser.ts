import { IUser } from "../models/User";

export default function getCleanUser(user: IUser) {
  const { password, __v, refreshToken, ...rest } = user._doc;
  return rest;
}
