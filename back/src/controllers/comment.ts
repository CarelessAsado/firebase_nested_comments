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
    { $match: { path: "" } },

    //Por c/object en al cual le hago populate, tmb puedo hacer una query adicional, y agregarle extra info
    //https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/#perform-an-uncorrelated-subquery-with--lookup
    {
      $facet: {
        commentsData: [
          { $skip: (page - 1) * limit },
          { $limit: limit },

          //una vez q limité el nro de PARENT CONV, hago el populate del user id y la subquery
          //POPULATE USERID
          {
            $lookup: {
              from: "users", //usé mongosh p/ver los nombres de las collections
              as: "userID", //le podés poner el nombre q quieras
              localField: "userID",
              foreignField: "_id",
            },
          },
          //hacer un project p/ seleccionar solo _id,username,email,img
          /*    { $project: { "userID.username": 1, "userID.email": 1, "userID.img": 1 } }, */
          //esto no sirve xq elimino todos los otros campos, creo q tengo q usar la opcion pipeline dentro de lookup, ver
          { $unwind: "$userID" },

          //SUBQUERY PER PARENT CONVERSATION
          {
            $lookup: {
              from: "comments", //usé mongosh p/ver los nombres de las collections
              as: "nested", //le podés poner el nombre q quieras
              //TUVE Q STRINGIFY EL _id xq sino $regexMatch se quejaba q el regex value no era el indicado
              let: { parentID: { $toString: "$_id" } },
              pipeline: [
                {
                  //cuando usas match con let variables, tenés q recurrir a $expr (esta en la doc, anotar bien dsp) y bueno, finalmente tuve q usar regexMatch. Todo esto lo podria haber hecho con un simple match si no fuera x las limitaciones de mongo XD
                  //https://mongoplayground.net/
                  $match: {
                    $expr: {
                      $regexMatch: {
                        input: "$path",
                        regex: "$$parentID", //Your text search here
                      },

                      //probar este una vez mas a ver q pasa, con el conocmiento pos facto
                      /* $match: {
                    path: { $convert: { input: "$_id", to: "string" } },
                  }, */

                      /*  $match: {
                    path: { $in: ["6355d1207f88f3934f46bf62"] },
                  }, */
                    },
                  },
                },
                //aca queria agregar un empty object si nested esta vacio, pero no es el momento indicado (ya q esto es x c/parent conversation mat)
                /* { $project: {} }, */
                { $count: "totalSubquery" },
              ],
            },
          },
          //el problema en realidad es q count si no hay docs, devuelve nada, y cuando hago unwind es como q desaparece "nested" key. Se me ocurre cotejar si el array esta vacio o no, y en base a eso agregar count:0. O podria hacer dsp, si nested no existe, agregar nested:0
          //https://www.google.com/search?q=%24count+returns+nothing+if+query+is+empty+mongodb&sxsrf=ALiCzsYUKI4VVmRcmnFf8U-TFAbxRFV4KA%3A1666914742492&ei=thlbY-7RHdLu1sQPnM6zcA&ved=0ahUKEwjuhOOozYH7AhVSt5UCHRznDA4Q4dUDCA8&uact=5&oq=%24count+returns+nothing+if+query+is+empty+mongodb&gs_lcp=Cgdnd3Mtd2l6EAMyBQghEKABMgUIIRCgAToKCAAQRxDWBBCwAzoICCEQFhAeEB06BAghEBU6BwghEKABEApKBAhNGAFKBAhBGABKBAhGGABQywZYhRRg0xVoAXABeACAAZUBiAHUB5IBAzAuOJgBAKABAcgBCMABAQ&sclient=gws-wiz
          //https://stackoverflow.com/questions/68891421/mongo-count-return-no-docoument-found-instead-of-0
          {
            $unwind: {
              path: "$nested",
              //a veces no hay children, si no pongo esto, al hacer unwind al empty array es como q no lo envia dsp al front el document. Por otro lado, al hacer unwind a un empty array, genera q nested desaparezca como key
              preserveNullAndEmptyArrays: true,
            },
          },
          //OPCION A. hago el unwind
          //podria usar un $set en donde cotejo is $nested existent? subComments:0 : subcomments: "$nested.totalSubquery"
          {
            $set: {
              subComments: {
                $cond: [
                  { $ifNull: ["$nested", false] },
                  //exists no se puede adentro de aggregation: https://stackoverflow.com/questions/41542746/mongoose-aggregate-using-exists-in-cond
                  /* { nested: { $exists: true } }, */
                  "$nested.totalSubquery",
                  0,
                ],
              },
            },
          },
          //projection p/borrar $nested
          { $project: { nested: 0 } },
          //OPCION B. sin unwind
          //podria usar un $set en donde cotejo is $nested.length ===0? subComments:0 : subcomments: "$nested.[0]totalSubquery"
        ],
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

  console.log(facet[0]);
  res.status(200).json(facet[0]);
});

export const getSubComments = errorWrapper(async (req, res, next) => {
  console.log("fooo fddsfsd");
  const { _id: userID } = req.user;
  let { page = 1, limit = 30 } = req.query;
  const { parentCommentID } = req.params;
  console.log(parentCommentID);
  limit = Number(limit);
  page = Number(page);
  if (limit > 50) {
    limit = 30;
  }

  //agregar pagination eventualmente
  const subComments = await Comment.find<IDirectory>({
    path: {
      $regex: parentCommentID,
    },
  }).populate({ path: "userID", select: "img username _id" });

  console.log("subComments result: ", subComments);
  res.status(200).json(subComments);
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
