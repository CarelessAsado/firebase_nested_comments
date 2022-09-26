import { RequestParamHandler } from "express";
import { Error403 } from "../ERRORS/customErrors";

export const checkOwnership: RequestParamHandler = function (
  req,
  res,
  next,
  userID: string
) {
  if (req.user._id !== userID) {
    return next(new Error403("You are not authorized to perform such action."));
  }
  return next();
};
