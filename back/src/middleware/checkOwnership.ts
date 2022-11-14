import { RequestParamHandler } from "express";
import { Error403 } from "../ERRORS/customErrors";

export const checkOwnership: RequestParamHandler = function (
  req,
  res,
  next,
  userID: string
) {
  //AGREGAR ADMIN EVENTUALMENTE
  console.log(req.user._id, "estamos en checkownership", 666);
  console.log(userID);
  if (!req.user._id.equals(userID)) {
    return next(new Error403("You are not authorized to perform such action."));
  }
  return next();
};
