import express from "express";
const router = express.Router();

import * as tasksControllers from "../controllers/tasks";
import { checkOwnership } from "../middleware/checkOwnership";

//SOLO SE ACTIVA SI LA ROUTE TIENE COMO PARAMS userID, x ej get("/tasks"), esta eximido
router.param("userID", checkOwnership);

router.post("/", tasksControllers.addTask);
router.get("/", tasksControllers.getAllTasks);
/* OWNERSHIP CHECK MIDDLEWARE */
router.delete("/:userID/:id", tasksControllers.deleteTask);
router.put("/:userID/:id", tasksControllers.updateTask);
router.get("/:userID/:id", tasksControllers.getSingleTask);

module.exports = router;
