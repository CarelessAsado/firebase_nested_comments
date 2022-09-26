import User, { IUser } from "../models/User";
import { Request, Response } from "express";

module.exports = {
  createUser: async (req: Request, res: Response): Promise<void> => {
    const { username, password, email } = req.body;
    const newUser = new User({ username, password, email });
    newUser.hashPass();
    try {
      const userCreated = await newUser.save();
      res.json(userCreated);
    } catch (error: any) {
      console.log(error);
      res.status(404).json(error.message);
    }
  },
  getAllUsers: async (req: Request, res: Response): Promise<void> => {
    try {
      const allUsers = await User.find<IUser>();
      res.json(allUsers);
    } catch (error: any) {
      console.log(error);
      res.status(404).json(error.message);
    }
  },
  getSingleUser: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const userFound = await User.findById<IUser>(id);
      res.json(userFound);
    } catch (error: any) {
      console.log(error);
      res.status(404).json(error.message);
    }
  },
};
