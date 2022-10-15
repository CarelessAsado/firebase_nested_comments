import express from "express";
import * as userControllers from "../controllers/users";
import { checkOwnership } from "../middleware/checkOwnership";
import multer from "../services/multer";
const router = express.Router();

//SOLO SE ACTIVA SI LA ROUTE TIENE COMO PARAMS userID, x ej get("/tasks"), esta eximido
router.param("userID", checkOwnership);

router.get("/users", userControllers.getAllUsers);
router.get("/users/:userID", userControllers.getSingleUser);
router.put("/users/:userID", userControllers.updateUser);
//agregar multer
router.post(
  "/users/profilepic/:userID",
  multer.single("profile"),
  userControllers.uploadImg
);
module.exports = router;
