import User, { IUser } from "../models/User";
import { Request, Response } from "express";
import errorWrapper from "../ERRORS/asyncErrorWrapper";
import getCleanUser from "../utils/getCleanUser";
import cloudVersion from "cloudinary";
const cloundinary = cloudVersion.v2;
export const createUser = errorWrapper(async (req, res) => {
  const { username, password, email } = req.body;
  const newUser = new User({ username, password, email });
  newUser.hashPass();

  const userCreated = await newUser.save();
  res.json(userCreated);
});

export const getAllUsers = errorWrapper(async (req, res) => {
  const allUsers = await User.find<IUser>();
  res.json(allUsers);
});

export const getSingleUser = errorWrapper(async (req, res) => {
  const { id } = req.params;

  const userFound = await User.findById<IUser>(id);
  res.json(userFound);
});

export const updateUser = errorWrapper(async (req, res, next) => {
  //ya hago el checkownership userID previamente
  const { userID } = req.params;
  const { email, username } = req.body;
  console.log(req.user, req.params, req.body);
  req.user.email = email;
  req.user.username = username;
  const savedUser = await req.user.save();
  res.json(getCleanUser(savedUser));
});

export const uploadImg = async (req: Request, res: Response): Promise<void> => {
  const { username, password, email } = req.body;
  //req.file no existe en body
  console.log(req.file, 666, "req.file");
  console.log(req.body.profilepic);
  console.log("upload img controller");
  res.json();
};
