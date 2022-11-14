import User, { IUser } from "../models/User";
import errorWrapper from "../ERRORS/asyncErrorWrapper";
import { CustomError, Error401, Error403 } from "../ERRORS/customErrors";
import { COOKIE_RT_KEY, COOKIE_OPTIONS, JWT_SECRET } from "../constants";
import jwt from "jsonwebtoken";
import getCleanUser from "../utils/getCleanUser";

export const registerUser = errorWrapper(async (req, res, next) => {
  const { username, email } = req.body;

  //uid de firebase guardar en mongo
  if (req.firebase.email !== email) {
    //tengo q ver como hacer un logout o cancelar la operacion cuando el mongo register falla, xq el useEffect listening for changes la esta cagando
    return next(new CustomError(403, "Firebase email does not match."));
  }
  //tendria q mandar el token, cotejar a que mail pertenece, y cotejar q sea identico al mail q me manda en input

  //ver q eventualmente tengo q organizar como sincronizo isConfirmed / hasValidated el email

  /*---NO HACE FALTA BUSCAR USER CON EMAIL PREVIAMENTE YA Q AL
        GUARDARLO AUTOMATICAMENTE MONGOOSE VA TIRAR ERROR DUPLICATE*/
  const newUser = new User({
    username,
    email,
    uid: req.firebase.uid,
  });
  const savedUser = await newUser.save();
  return res.status(201).json(getCleanUser(savedUser));
});

export const loginUser = errorWrapper(async (req, res, next) => {
  /*---------------JWT INSTANCE METHOD-------------*/
  const cleanUser = getCleanUser(req.user);

  return res.status(200).json({ user: cleanUser });
});

export const logout = errorWrapper(async (req, res, next) => {
  console.log(req.cookies, "COOKIES");

  const cookies = req.cookies;
  if (!cookies?.[COOKIE_RT_KEY]) {
    return res.sendStatus(204);
  }

  //get cookie and delete it
  const jwtRefreshToken = cookies[COOKIE_RT_KEY] as string;
  res.clearCookie(COOKIE_RT_KEY, COOKIE_OPTIONS);

  const userFound = await User.findOne({ refreshToken: jwtRefreshToken });

  if (userFound) {
    //BORRAR RT de la Db
    const filteredRefreshTokens = userFound.refreshToken.filter(
      (rt) => rt !== jwtRefreshToken
    );
    console.log(
      filteredRefreshTokens.length,
      userFound.refreshToken.length,
      "ver q no coincidan x un nro!!!"
    );
    userFound.refreshToken = [...filteredRefreshTokens];
    await userFound.save();
  }

  //regardless of whether there is or there isn't a userFound, we send 204
  return res.sendStatus(204);
});

export const refreshMyToken = errorWrapper(async (req, res, next) => {
  console.log(req.cookies, "COOKIES");

  const cookies = req.cookies;

  if (!cookies?.[COOKIE_RT_KEY]) {
    return next(new Error401("Refresh token is missing."));
  }

  const jwtRefreshToken = cookies[COOKIE_RT_KEY] as string;

  //clear cookie
  res.clearCookie(COOKIE_RT_KEY, COOKIE_OPTIONS);

  const userFound = await User.findOne({ refreshToken: jwtRefreshToken });
  //HACKER ALERT decrypt token to search for user and delete all refreshtokens
  if (!userFound) {
    jwt.verify(jwtRefreshToken, JWT_SECRET, async function (err, user) {
      //expired RT, we just send the error
      if (err) {
        return next(new Error403("Hacker you've been caught."));
      }

      const hackedUser = await User.findById<IUser>(
        (user as IRefreshtoken)._id
      );
      if (hackedUser) {
        // NO HACKEDUSER?
        hackedUser.refreshToken = [];
        await hackedUser.save();
      }
    });
    return next(new Error403("Hacker you've been caught."));
  }
  //VALID TOKEN, BORRAMOS EL VIEJO TOKEN DE LA BD, y chequeamos si está o no vencido
  const filteredRefreshTokens = userFound.refreshToken.filter(
    (rt) => rt !== jwtRefreshToken
  );
  console.log(
    filteredRefreshTokens.length,
    userFound.refreshToken.length,
    "ver q no coincidan x un nro!!!"
  );
  jwt.verify(jwtRefreshToken, JWT_SECRET, async function (err, user) {
    //EXPIRED TOKEN
    try {
      if (err) {
        userFound.refreshToken = [...filteredRefreshTokens];
        await userFound.save();
        return next(new Error403("Expired refresh token."));
      }

      const newAccessToken = userFound.generateAccessToken();
      const newRefreshToken = userFound.generateRefreshToken();
      res.cookie(COOKIE_RT_KEY, newRefreshToken, COOKIE_OPTIONS);
      //guardamos el nuevo refresh tkn en la Db
      userFound.refreshToken = [...filteredRefreshTokens, newRefreshToken];

      await userFound.save();

      //front espera user y accessTkn
      return res
        .status(200)
        .json({ accessToken: newAccessToken, user: getCleanUser(userFound) });
    } catch (error) {
      next(error);
    }
  });
});
