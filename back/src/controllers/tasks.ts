import errorWrapper from "../ERRORS/asyncErrorWrapper";
import { CustomError } from "../ERRORS/customErrors";

/*VER XQ NO ME SALEN LOS METODOS DE MONGOOSE*/
import Task, { ITask } from "../models/Task";
import User, { IUser } from "../models/User";

export const addTask = errorWrapper(async (req, res, next) => {
  const { name } = req.body;

  const { _id } = req.user;

  const userPop = await User.findById<IUser>(_id); /* .populate("tasks") */
  const newTask = new Task({ name, userID: _id });
  const addedTask = await newTask.save();
  userPop?.tasks.push(addedTask._id);
  await userPop?.save();
  res.json(addedTask);
});

export const getAllTasks = errorWrapper(async (req, res, next) => {
  const { _id: userID } = req.user;

  const allTasks = await Task.find<ITask>({ userID }, { userID: 0 });

  res.status(200).json(allTasks);
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
  await Task.findByIdAndDelete(id);
  await User.findByIdAndUpdate(req.user._id, { $pull: { tasks: id } });
  return res.sendStatus(204);
});
