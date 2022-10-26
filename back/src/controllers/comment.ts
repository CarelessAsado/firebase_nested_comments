import User, { IUser } from "../models/User";
import errorWrapper from "../ERRORS/asyncErrorWrapper";
import { CustomError, Error401, Error403 } from "../ERRORS/customErrors";
import { COOKIE_RT_KEY, COOKIE_OPTIONS, JWT_SECRET } from "../constants";
import jwt from "jsonwebtoken";
import getCleanUser from "../utils/getCleanUser";

/*VER XQ NO ME SALEN LOS METODOS DE MONGOOSE*/
import Task, { ITask } from "../models/Task";
import Comment, { IDirectory } from "../models/Comment";
import { _FilterQuery } from "mongoose";
import { Request } from "express";

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

interface IParams {
  page: number;
  limit: number;
}

export const getAllTasks = errorWrapper(async (req, res, next) => {
  const { _id: userID } = req.user;
  let { page = 1, limit = 30 } = req.query;

  limit = Number(limit);
  page = Number(page);
  if (limit > 50) {
    limit = 30;
  }
  /* const allComments = await Comment.find<IDirectory>(/* { userID } ).populate(
    { path: "userID", select: "img username _id" }
  ); */
  type IFacet = { commentsData: IDirectory[] };
  const facet = await Comment.aggregate<IFacet>([
    {
      //hacer un userID dinamico
      //ver si se puede hacer $lookup adentro de $facet
      //$lookup requires either 'pipeline' or both 'localField' and 'foreignField' to be specified
      $lookup: {
        from: "users", //usé mongosh p/ver los nombres de las collections
        as: "userID", //le podés poner el nombre q quieras
        localField: "userID",
        foreignField: "_id",
      },
    },
    //x alguna razón $lookup devuelve un array, entonces lo vuelvo a transformar en object con $unwind
    //otras posibles alternativas: https://stackoverflow.com/questions/41602831/convert-a-lookup-result-to-an-object-instead-of-array
    { $unwind: "$userID" },
    //hacer un project p/ seleccionar solo _id,username,email,img
    /*    { $project: { "userID.username": 1, "userID.email": 1, "userID.img": 1 } }, */
    //esto no sirve xq elimino todos los otros campos, creo q tengo q usar la opcion pipeline dentro de lookup, ver
    //https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/#perform-an-uncorrelated-subquery-with--lookup
    {
      $facet: {
        commentsData: [{ $skip: (page - 1) * limit }, { $limit: limit }],
        count: [{ $count: "totalComments" }],
      },
    },
    //count viene como un single Object adentro de un array
    //hay q hacerlo fuera de $facet y count, xq ese array se le agrega una vez finalizado $facet creo, aunq no estoy seguro
    //cotejar tmb si puedo deestructurar el array completo de $facet
    {
      $unwind: "$count",
    },
    //ahora pasa a ser un obj adentro de otro obj, así count:{totalComments:3}, asi q destructuro con $project
    {
      $project: {
        commentsData: "$commentsData",
        count: "$count.totalComments",
      },
    },
  ]);

  console.log(
    facet,
    99999999999,
    "holaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
  );
  res.status(200).json(facet[0].commentsData);
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
