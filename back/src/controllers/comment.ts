import User, { IUser } from "../models/User";
import errorWrapper from "../ERRORS/asyncErrorWrapper";
import { CustomError, Error401, Error403 } from "../ERRORS/customErrors";
import { COOKIE_RT_KEY, COOKIE_OPTIONS, JWT_SECRET } from "../constants";
import jwt from "jsonwebtoken";
import getCleanUser from "../utils/getCleanUser";

/*VER XQ NO ME SALEN LOS METODOS DE MONGOOSE*/
import Task, { ITask } from "../models/Task";
import Comment, { IDirectory } from "../models/Comment";

export const createComment = errorWrapper(async (req, res, next) => {
  const { value, id, path } = req.body;
  console.log(req.body);
  const { _id } = req.user;
  if (!id) {
    const newComment = new Comment({ userID: _id, value });
    const addedComment = await newComment.save();
    return res.json(addedComment);
  }
  const newComment = new Comment({ userID: _id, value, path: `${path},${id}` });
  const addedComment = await newComment.save();
  return res.json(addedComment);
});

export const getAllTasks = errorWrapper(async (req, res, next) => {
  const { _id: userID } = req.user;

  const allComments = await Comment.find<IDirectory>({ userID });

  res.status(200).json(allComments);
});

export const getSingleTask = errorWrapper(async (req, res, next) => {
  const { id } = req.params;

  const task = await Task.findById<ITask>(id);
  if (!task) {
    return next(new CustomError(404, "Task does not exist."));
  }
  res.status(200).json(task);
});

export const updateTask = errorWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { name, done } = req.body;
  console.log(req.body, "estamos en update");
  const taskToUpdate = await Task.findById(id);

  if (!taskToUpdate) {
    return next(new CustomError(404, "Task does not exist."));
  }

  taskToUpdate.name = name;
  taskToUpdate.done = done;

  await taskToUpdate.save();
  console.log(taskToUpdate, "ver q done este bien");
  return res.json(taskToUpdate);
});

export const deleteTask = errorWrapper(async (req, res, next) => {
  const { id } = req.params;
  //check ownership?
  console.log(req.body, req.params);
  /* (!i.path.includes(comment.path) && i.path === comment.path) ||
          //con este borro el item q clickeo, e incluyo todos (x ende tengo q filtrar +)
          i.id !== comment.id
      ) */
  const regExp = new RegExp("^" + req.body.path + "," + req.body._id, "gi");
  const found = await Comment.deleteMany({
    $or: [{ path: { $regex: regExp } }, { _id: req.body._id }],
  });
  /*   const found = await Comment.find({
    $or: [{ path: { $regex: regExp } }, { _id: req.body._id }],
  }); */
  /* {$and:[{path: req.body.path },{}]} */
  console.log(found);
  /*   await Task.findByIdAndDelete(id);
  await User.findByIdAndUpdate(req.user._id, { $pull: { tasks: id } }); */
  return res.sendStatus(204);
});
