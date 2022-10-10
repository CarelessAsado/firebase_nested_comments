/* import { Types } from "mongoose"; */
//cant have imports check whats going on
//ahora desde TS 2.9 exise una sintaxis especial
//https://stackoverflow.com/questions/39040108/import-class-in-definition-file-d-ts
declare namespace Express {
  interface Request {
    user: import("../models/User").IUser;
    firebase: { email: string; uid: string };
  }
}
