import { ErrorRequestHandler } from "express";
import { CustomError } from "./customErrors";

const finalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  console.log(error instanceof CustomError, "final error handler middle");
  console.log(error.message);

  /*---------- MONGO VALIDATION ERROR */
  if (error.name == "ValidationError") {
    let errors = Object.values(error.errors).map((val: any) => val.message);
    if (errors.length > 1) {
      return res.status(400).json({ message: errors.join(" ") });
    } else {
      return res.status(400).json({ message: errors });
    }
  }

  if (error.name === "CastError") {
    return res.status(404).json({
      message: "Error de sintaxis. El id está incompleto, o no existe.",
    });
  }

  //DUPLICATE KEY
  if (error.code == 11000) {
    console.log(JSON.stringify(error));
    console.log(error.name);
    return res.status(409).send({ message: "Duplicated object." });
  }

  //DEFAULT
  return res
    .status(error?.statusCode || 500)
    .json({ message: error?.message || "Some error happened." });
};
export default finalErrorHandler;
