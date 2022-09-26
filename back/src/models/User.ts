import { model, Schema, Types, Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { EXPIRATION_TOKENS, JWT_SECRET } from "../constants";

interface DocumentResult<T> {
  _doc: T;
}
export interface IUser extends Document, DocumentResult<IUser> {
  username: string;
  password: string;
  email: string;
  tasks: Types.Array<Types.ObjectId>;
  refreshToken: string[];
  /*------INSTANCE METHODS-----------------*/
  hashPass: () => Promise<void>;
  verifyPass: (password: string) => Promise<boolean>;
  generateAccessToken: () => string;
  generateEmailToken: () => string;
  generateRefreshToken: () => string;
}

export const User = new Schema<IUser>({
  username: {
    type: String,
    required: [true, "Username cannot be an empty value. "],
    maxlength: [15, "Username must not have more than 15 characters. "],
  },
  password: {
    type: String,
    required: [true, "Password cannot be an empty value. "],
    select: false,
  },
  email: {
    type: String,
    required: [true, "Email cannot be empty an empty value. "],
    unique: true,
    trim: true,
    lowercase: true,
  },
  tasks: [{ type: "ObjectID", ref: "Task" }],
  refreshToken: [String],
});
/*-------------------INSTANCE METHODS-----------------------*/
User.methods.hashPass = async function () {
  this.password = await bcrypt.hash(this.password, 10);
};
User.methods.verifyPass = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};
/*-------------------GENERATE JWT ACCESS/REFRESH TOKENS---------------------*/
User.methods.generateAccessToken = function () {
  return jwt.sign({ _id: this._id, email: this.email }, JWT_SECRET, {
    expiresIn: EXPIRATION_TOKENS.access,
  });
};
User.methods.generateEmailToken = function () {
  return jwt.sign({ _id: this._id, email: this.email }, JWT_SECRET, {
    expiresIn: EXPIRATION_TOKENS.emailToken,
  });
};
User.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, JWT_SECRET, {
    expiresIn: EXPIRATION_TOKENS.refresh,
  });
};

/*------------------------------------------------*/
const userModel = model<IUser>("User", User);
export default userModel;
