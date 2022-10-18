import multer from "multer";
import path from "path";
import { CustomError } from "../ERRORS/customErrors";

const storage = multer.diskStorage({
  //Creo q Cloudinary se encarga del renaming
});

const extAccepted = [".jpg", ".jpeg", ".png", ".webp"];
export default multer({
  storage,
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    console.log("FILTRANDOOOOOOOOOOOOOOOO");
    if (!extAccepted.includes(ext)) {
      return cb(
        new CustomError(404, `Extensiones válidas:${extAccepted.join(" / ")}.`)
      );
    }
    cb(null, true);
  },
});
