import express from "express";
require("dotenv").config();
import connectDB from "./db/connect";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import verifyToken from "./middleware/verifyToken";
import finalErrorHandler from "./ERRORS/finalErrorHandler";
import { BACKEND_ENDPOINTS, FRONTEND_URL } from "./constants";

/*---------------------------------*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ credentials: true, origin: FRONTEND_URL }));

/*----------------------------------- */
const PORT = process.env.PORT || 5000;
const connectServer = () => {
  app.listen(PORT, () => {
    console.log("Port is good " + PORT);
  });
};
connectDB(process.env.MONGODB_URI as string, connectServer);

/*--------------ROUTES-----------------------*/
/*----------UNPROTECTED ROUTES---------*/
const authRoutes = require("./routes/auth");
app.use(BACKEND_ENDPOINTS.ROOT_AUTH, authRoutes);
/*-----------PROTECTED ROUTES--------*/
/*---MIDDLEWARE-*/
app.use(verifyToken);
const tasksRoutes = require("./routes/tasks");
app.use(BACKEND_ENDPOINTS.ROOT_TASKS, tasksRoutes);
const usersRoutes = require("./routes/users");
app.use(BACKEND_ENDPOINTS.ROOT, usersRoutes);

app.use(finalErrorHandler);
