import express from "express";
require("dotenv").config();
import { createServer } from "http";
import { Server } from "socket.io";
const app = express();
const httpServer = createServer(app);
import { BACKEND_ENDPOINTS, FRONTEND_URL, MONGO } from "./constants";
/* ------------------IO------------------------- */
const io = new Server(httpServer, {
  cors: {
    credentials: true,
    origin: [FRONTEND_URL],
  },
});
export type IOType = typeof io;

import connectDB from "./db/connect";
import cors from "cors";
import cookieParser from "cookie-parser";
import verifyMongoUser, { verifyFirebaseToken } from "./middleware/verifyToken";
import finalErrorHandler from "./ERRORS/finalErrorHandler";
import { startSocket } from "./services/socket";

/*---------------------------------*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ credentials: true, origin: FRONTEND_URL }));

/*----------------------------------- */
const PORT = process.env.PORT || 5000;
const connectServer = () => {
  console.log("holaaaa");
  httpServer.listen(PORT, () => {
    console.log("Port is good " + PORT);
    console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS, "hola");
  });
};
console.log("holaaaa");
connectDB(MONGO, connectServer);

/*--------------ROUTES-----------------------*/
startSocket(io);
/*----------UNPROTECTED ROUTES---------*/
const authRoutes = require("./routes/auth");
app.use(BACKEND_ENDPOINTS.ROOT_AUTH, authRoutes);
/*-----------PROTECTED ROUTES--------*/
/*---MIDDLEWARE-*/
app.use(verifyFirebaseToken);
app.use(verifyMongoUser);
const commentsRoutes = require("./routes/comments");
app.use(BACKEND_ENDPOINTS.ROOT_COMMENTS, commentsRoutes);
const tasksRoutes = require("./routes/tasks");
app.use(BACKEND_ENDPOINTS.ROOT_TASKS, tasksRoutes);
const usersRoutes = require("./routes/users");
app.use(BACKEND_ENDPOINTS.ROOT, usersRoutes);
app.use("*", (req, res) => {
  res.status(404).json("The resource you are looking for cannot be found.");
});

app.use(finalErrorHandler);
