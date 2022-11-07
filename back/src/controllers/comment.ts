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

export const getAllParentComments = errorWrapper(async (req, res, next) => {
  const { _id: userID } = req.user;
  let { page = 1, limit = 30 } = req.query;

  const SUBCOMMENTS_TO_RETRIEVE_PER_PARENT = 1;

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
      $match: {
        path: "",
      },
    },
    //Por c/object en al cual le hago populate, tmb puedo hacer una query adicional, y agregarle extra info
    //https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/#perform-an-uncorrelated-subquery-with--lookup
    {
      $facet: {
        commentsData: [
          //order latest messages first
          {
            //tengo q poner $sort antes del skip y el limit, xq sino no obtengo la data + reciente
            $sort: {
              createdAt: -1,
            },
          },
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

          { $unwind: "$userID" },
          //SUBQUERY PER PARENT CONVERSATION,busco TODOS los children (FIRST LEVEL, y subsequents)
          {
            $lookup: {
              from: "comments",
              //usé mongosh p/ver los nombres de las collections
              as: "nested",
              //le podés poner el nombre q quieras
              let: {
                parentID: {
                  $toString: "$_id",
                },
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $regexMatch: {
                        input: "$path",
                        regex: "$$parentID",
                        //Your text search here
                      },
                    },
                  },
                },
              ],
            },
          },
          //ACA CIERRA LOOKUP
          //el problema en realidad es q count si no hay docs, devuelve nada, y cuando hago unwind es como q desaparece "nested" key. Se me ocurre cotejar si el array esta vacio o no, y en base a eso agregar count:0. O podria hacer dsp, si nested no existe, agregar nested:0
          //https://www.google.com/search?q=%24count+returns+nothing+if+query+is+empty+mongodb&sxsrf=ALiCzsYUKI4VVmRcmnFf8U-TFAbxRFV4KA%3A1666914742492&ei=thlbY-7RHdLu1sQPnM6zcA&ved=0ahUKEwjuhOOozYH7AhVSt5UCHRznDA4Q4dUDCA8&uact=5&oq=%24count+returns+nothing+if+query+is+empty+mongodb&gs_lcp=Cgdnd3Mtd2l6EAMyBQghEKABMgUIIRCgAToKCAAQRxDWBBCwAzoICCEQFhAeEB06BAghEBU6BwghEKABEApKBAhNGAFKBAhBGABKBAhGGABQywZYhRRg0xVoAXABeACAAZUBiAHUB5IBAzAuOJgBAKABAcgBCMABAQ&sclient=gws-wiz
          //https://stackoverflow.com/questions/68891421/mongo-count-return-no-docoument-found-instead-of-0
          //firstLevelChildren : array de FIRST LEVEL CHILDREN
          {
            $addFields: {
              children: {
                //hago sorting del array p/mostrar los comentarios + recientes 1ero
                $sortArray: {
                  input: {
                    $filter: {
                      input: "$nested",
                      as: "item",
                      cond: {
                        $eq: [
                          "$$item.path",
                          {
                            $concat: [
                              ",",
                              {
                                $toString: "$_id",
                              },
                            ],
                          },
                        ],
                      },
                    },
                  },
                  sortBy: {
                    createdAt: -1,
                  },
                },
              },
            },
          },
          //dsp de esto, tengo q contar todos los first levelchildren,
          //ver si puedo contar y en 2do lugar hacer el slice, todo en el mismo set
          {
            $set: {
              //CONTAMOS CANTIDAD DE ITEMS EN EL ARRAY, y le restamos la cantidad de subdocs q vamos a devolverle al user junto al parent comment
              totalSubcomments: {
                $size: "$nested",
              },
              children: {
                $firstN: {
                  n: SUBCOMMENTS_TO_RETRIEVE_PER_PARENT,
                  input: "$children",
                },
              },
              //ACA TENGO Q HACER MATEMATICA,con el nroslice q haga al array de FIRST LEVEL CHILDREN
              remainingChildren: {
                $subtract: [
                  {
                    $size: "$children",
                  },
                  SUBCOMMENTS_TO_RETRIEVE_PER_PARENT,
                ],
              },
            },
          },
          //como el array de remainingFirstLevelComments puede estar vacío. Al restar 1 queda en negativo, asi q lo seteamos a 0
          {
            $set: {
              remainingChildren: {
                $cond: [
                  {
                    $lt: ["$remainingChildren", 0],
                  },
                  0,
                  "$remainingChildren",
                ],
              },
            },
          },
          //recien ahi hago el nuevo mapping p/contar los subchildlren de los firstlevel children
          //LETS MAP FIRSTLEVEL CHILDREN, and for document,set A NEW KEY fir the sake of fetching more children on the client side
          {
            $addFields: {
              children: {
                $map: {
                  input: "$children",
                  as: "item",
                  in: {
                    $mergeObjects: [
                      "$$item",
                      {
                        remainingChildren: {
                          //COUNT THE ELEMENTS IN THE ARRAY TO ADD FETCH MORE BTN ON THE CLIENT SIDE
                          $size: {
                            // PREVIAMENTE A CONTAR, filtramos todos los children del FIRST LEVEL CHILD
                            $filter: {
                              input: "$nested",
                              as: "itemNested",
                              cond: {
                                $regexMatch: {
                                  input: "$$itemNested.path",
                                  regex: {
                                    $concat: [
                                      "$$item.path",
                                      ",",
                                      {
                                        $toString: "$$item._id",
                                      },
                                    ],
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
          //projection p/borrar $nested
          {
            $project: {
              nested: 0,
            },
          },
        ],
        count: [
          {
            $count: "totalComments",
          },
        ],
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
  //hacer fetchear 5 max p/arrancar, asi veo como anda el sistema, dsp pasar a 20,

  //es complicado, xq c/branch puede tener infinitas variaciones, entonces, puedo hacer un fetch de todo y enviar 20. Pero, como sé cual path esta truncado, y cual esta ya completo???? Esta info la necesito p/determinar si pongo o no un fetch more btn
  //agregar pagination eventualmente
  const subComments = await Comment.find<IDirectory>({
    path: {
      $regex: parentCommentID,
    },
  }).populate({ path: "userID", select: "img username _id" });

  console.log("subComments result: ", subComments);
  res.status(200).json(subComments);
});
export const getMoreFirstLevelComments = errorWrapper(async (req, res, next) => {
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
  //hacer fetchear 5 max p/arrancar, asi veo como anda el sistema, dsp pasar a 20,

  //es complicado, xq c/branch puede tener infinitas variaciones, entonces, puedo hacer un fetch de todo y enviar 20. Pero, como sé cual path esta truncado, y cual esta ya completo???? Esta info la necesito p/determinar si pongo o no un fetch more btn
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
