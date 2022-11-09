import express from "express";
const router = express.Router();

import * as commentsController from "../controllers/comment";
import { checkOwnership } from "../middleware/checkOwnership";

//SOLO SE ACTIVA SI LA ROUTE TIENE COMO PARAMS userID, x ej get("/tasks"), esta eximido
router.param("userID", checkOwnership);

router.post("/", commentsController.createComment);
router.get("/", commentsController.getAllParentComments);
router.post("/subcomments/:parentCommentID", commentsController.getSubComments);
/* OWNERSHIP CHECK MIDDLEWARE */
router.delete("/:userID/:id", commentsController.deleteComment);
router.put("/:userID/:id", commentsController.updateComment);
router.get("/:userID/:id", commentsController.getSingleTask);

module.exports = router;
