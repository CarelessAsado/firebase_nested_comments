import User, { IUser } from "../models/User";
import { Request, Response } from "express";
import errorWrapper from "../ERRORS/asyncErrorWrapper";
import getCleanUser from "../utils/getCleanUser";
import cloudVersion from "cloudinary";
import { CustomError } from "../ERRORS/customErrors";
const cloudinary = cloudVersion.v2;
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

export const getSingleUser = errorWrapper(async (req, res, next) => {
  const { userid } = req.params;

  const userFound = await User.findById<IUser>(userid);
  if (!userFound) return next(new CustomError(404, "Mongo user not found."));
  const cleanUser = getCleanUser(userFound);
  res.json(cleanUser);
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

export const uploadImg = errorWrapper(async (req, res) => {
  const { username, password, email } = req.body;
  //req.file no existe en body
  console.log(req.file, 666, "req.file");
  console.log(req.body.profilepic);
  console.log("upload img controller");
  if (req.user.public_id) {
    await cloudinary.uploader.destroy(req.user.public_id);
    req.user.img = "";
    req.user.public_id = "";
  }
  //puede q el user simplemente quiera borrar la foto, en cuyo caso no cargamos imagen nueva
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "TS_FIREBASE",
    });
    console.log(result);
    req.user.img = result.secure_url;
    req.user.public_id = result.public_id;
  }

  const userSaved = await req.user.save();

  res.json(userSaved);
});
