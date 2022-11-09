import errorWrapper from "../ERRORS/asyncErrorWrapper";
import { CustomError } from "../ERRORS/customErrors";

/*VER XQ NO ME SALEN LOS METODOS DE MONGOOSE*/
import Task, { ITask } from "../models/Task";
import Comment, { IDirectory } from "../models/Comment";
import mongoose from "mongoose";

type IFacet = { commentsData: IDirectory[]; count: number };
const DEFAULT_FACET_RESPONSE: IFacet = { commentsData: [], count: 0 };
const SUBCOMMENTS_TO_RETRIEVE_PER_PARENT = 3;

export const createComment = errorWrapper(async (req, res, next) => {
  //enviar parentID
  const { value, parentID } = req.body;
  console.log(req.body);
  const { _id } = req.user;

  const newComment = new Comment({ userID: _id, value, parentID });
  const addedComment = await newComment.save();
  console.log(addedComment);
  return res.json(addedComment);
});

export const getAllParentComments = errorWrapper(async (req, res, next) => {
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

  const facet = await Comment.aggregate<IFacet>([
    {
      $match: {
        parentID: null,
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
                parentID: "$_id",
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$parentID", "$$parentID"],
                    },
                  },
                },
                {
                  $sort: {
                    createdAt: 1,
                  },
                },

                //hacer esto dsp de hacer el sliceeeeeeeeeeeee, p/evitar lookups innecesarios
                {
                  $lookup: {
                    from: "users", //usé mongosh p/ver los nombres de las collections
                    as: "userID", //le podés poner el nombre q quieras
                    localField: "userID",
                    foreignField: "_id",
                  },
                },

                { $unwind: "$userID" },
              ],
            },
          },
          //ACA CIERRA LOOKUP
          //el problema en realidad es q count si no hay docs, devuelve nada, y cuando hago unwind es como q desaparece "nested" key. Se me ocurre cotejar si el array esta vacio o no, y en base a eso agregar count:0. O podria hacer dsp, si nested no existe, agregar nested:0
          //https://www.google.com/search?q=%24count+returns+nothing+if+query+is+empty+mongodb&sxsrf=ALiCzsYUKI4VVmRcmnFf8U-TFAbxRFV4KA%3A1666914742492&ei=thlbY-7RHdLu1sQPnM6zcA&ved=0ahUKEwjuhOOozYH7AhVSt5UCHRznDA4Q4dUDCA8&uact=5&oq=%24count+returns+nothing+if+query+is+empty+mongodb&gs_lcp=Cgdnd3Mtd2l6EAMyBQghEKABMgUIIRCgAToKCAAQRxDWBBCwAzoICCEQFhAeEB06BAghEBU6BwghEKABEApKBAhNGAFKBAhBGABKBAhGGABQywZYhRRg0xVoAXABeACAAZUBiAHUB5IBAzAuOJgBAKABAcgBCMABAQ&sclient=gws-wiz
          //https://stackoverflow.com/questions/68891421/mongo-count-return-no-docoument-found-instead-of-0

          //dsp de esto, tengo q contar todos los first levelchildren,
          //ver si puedo contar y en 2do lugar hacer el slice, todo en el mismo set
          {
            $set: {
              //CONTAMOS CANTIDAD DE ITEMS EN EL ARRAY, y le restamos la cantidad de subdocs q vamos a devolverle al user junto al parent comment
              totalSubcomments: {
                $size: "$nested",
              },
              children: {
                $lastN: {
                  n: SUBCOMMENTS_TO_RETRIEVE_PER_PARENT,
                  input: "$nested",
                },
              },
              //ACA TENGO Q HACER MATEMATICA,con el nroslice q haga al array de FIRST LEVEL CHILDREN
              remainingChildren: {
                $subtract: [
                  {
                    $size: "$nested",
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
  //si no hay comments en la collection no vuelve nada
  console.log(facet[0]);
  res.status(200).json(facet[0] || DEFAULT_FACET_RESPONSE);
});

export const getSubComments = errorWrapper(async (req, res, next) => {
  const { _id: userID } = req.user;
  let { page = 1 } = req.query;
  page = Number(page);
  const { parentCommentID } = req.params;
  const lastComment = req.body;

  console.log(req.body);

  const facet = await Comment.aggregate<IFacet>([
    {
      $match: {
        //necesito mandar el ultimo children, me va a dar toda la info q necesito
        parentID: new mongoose.Types.ObjectId(parentCommentID),
        createdAt: {
          $lte: new Date(lastComment.createdAt),
        },
        _id: {
          $not: {
            $eq: new mongoose.Types.ObjectId(lastComment._id),
          },
        },
      },
    },
    //Por c/object en al cual le hago populate, tmb puedo hacer una query adicional, y agregarle extra info
    //https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/#perform-an-uncorrelated-subquery-with--lookup
    {
      $facet: {
        commentsData: [
          //order latest messages first
          {
            $sort: {
              createdAt: -1,
            },
          },

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
        //como no puedo usar $lastN en facet, sino q uso limit, tengo q volver a revertir el array p/q los subcomentarios + antiguos aparezcan on top, en la UI de la PARENT COMMENT
        commentsData: { $reverseArray: "$commentsData" },
        count: {
          $subtract: [
            "$count.totalComments",
            SUBCOMMENTS_TO_RETRIEVE_PER_PARENT,
          ],
        },
      },
    },

    //como el array de remainingFirstLevelComments puede estar vacío. Al restar 1 queda en negativo, asi q lo seteamos a 0
    {
      $set: {
        count: {
          $cond: [
            {
              $lt: ["$count", 0],
            },
            0,
            "$count",
          ],
        },
      },
    },
  ]);

  console.log(facet[0]);
  res.status(200).json(facet[0] || DEFAULT_FACET_RESPONSE);
});

export const getSingleTask = errorWrapper(async (req, res, next) => {
  const { id } = req.params;

  const task = await Task.findById<ITask>(id);
  if (!task) {
    return next(new CustomError(404, "Task does not exist."));
  }
  res.status(200).json(task);
});

export const updateComment = errorWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { name, done } = req.body;
  console.log(req.body, "estamos en update");
  const commentToUpdate = await Comment.findById(id);

  if (!commentToUpdate) {
    return next(new CustomError(404, "Task does not exist."));
  }

  //UPDATE STH

  await commentToUpdate.save();
  console.log(commentToUpdate, "ver q done este bien");
  return res.json(commentToUpdate);
});

export const likeUnlikeComment = errorWrapper(async (req, res, next) => {
  const { id } = req.params;

  const commentToUpdate = await Comment.findById(id);

  if (!commentToUpdate) {
    return next(new CustomError(404, "Comment does not exist."));
  }

  const index = commentToUpdate.likes.findIndex((user) =>
    user.equals(req.user._id)
  );

  if (index < 0) {
    //USER NO ESTA INCLUIDO, asi q LIKEAMOS
    commentToUpdate.likes.push(req.user._id);
  } else {
    //USER YA ESTA INCLUIDO, significa  q deslikea
    commentToUpdate.likes = commentToUpdate.likes.filter(
      (id) => !id.equals(req.user._id)
    );
  }

  const saved = await commentToUpdate.save();

  return res.json(saved);
});

export const deleteComment = errorWrapper(async (req, res, next) => {
  const { id } = req.params;

  //check ownership? eventualmente pasar a esto a un MIDDLEWARE
  const found = await Comment.findOneAndDelete({ id, userID: req.user._id });

  if (found?.parentID === null) {
    //aca no entramos si borramos subcomment
    await Comment.deleteMany({ parentID: id });
  }

  return res.sendStatus(200);
});
