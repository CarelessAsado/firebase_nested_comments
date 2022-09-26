/* import { Types } from "mongoose"; */
//cant have imports check whats going on
declare namespace Express {
  interface Request {
    user: { email: string; _id: Types.ObjectId };
  }
}
