import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { HEADER_ACCESS_TOKEN, JWT_SECRET } from "../constants";
import { CustomError } from "../ERRORS/customErrors";

export default function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.header(HEADER_ACCESS_TOKEN) as string;
  console.log("VERIFY TOKEN MIDDLE");
  console.log(req.url, 666, "aca arranca", 888);
  console.log(req.ip);
  if (!token) {
    return next(new CustomError(401, "Token was not provided."));
  }

  jwt.verify(token, JWT_SECRET, function (err, user) {
    if (err) {
      return next(new CustomError(403, "Token is not valid."));
    }
    const { _id, email } = user as Itoken;
    req.user = { _id, email };
  });
  return next();
}
