import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { HEADER_ACCESS_TOKEN, JWT_SECRET } from "../constants";
import { CustomError } from "../ERRORS/customErrors";
import { firebaseAuth } from "../services/firebase";
import User, { IUser } from "../models/User";

export async function verifyFirebaseToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.header(HEADER_ACCESS_TOKEN) as string;
  console.log("PRIMER VERIFY TOKEN FIREBASE MIDDLE");
  console.log(req.url, 666, "aca arranca", 888);

  if (!token) {
    return next(new CustomError(401, "Token was not provided."));
  }
  try {
    const decoded = await firebaseAuth.verifyIdToken(token);
    console.log("DECODED UID AND EMAIL :", decoded.uid, decoded.email, 666);
    //buscar con el uid o el mail el user en MONGO y setearlo
    const { uid, email } = decoded;
    req.firebase = { uid, email: email as string };

    return next();
  } catch (error) {
    return next(error);
  }
}
export default async function verifyMongoUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    //buscar con el uid o el mail el user en MONGO y setearlo
    console.log("estamos en 2do middle", req.firebase, 999);
    const found = await User.findOne({ uid: req.firebase.uid });
    if (!found) {
      return next(new CustomError(404, "Mongo user not found."));
    }
    console.log("CHECKING USER MIDDLEWARE COMPLETED");
    req.user = found;
    return next();
  } catch (error) {
    return next(error);
  }
}
