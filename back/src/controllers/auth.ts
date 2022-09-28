import User, { IUser } from "../models/User";
import errorWrapper from "../ERRORS/asyncErrorWrapper";
import { CustomError, Error401, Error403 } from "../ERRORS/customErrors";
import { COOKIE_RT_KEY, COOKIE_OPTIONS, JWT_SECRET } from "../constants";
import jwt from "jsonwebtoken";
import getCleanUser from "../utils/getCleanUser";

export const registerUser = errorWrapper(async (req, res, next) => {
  const { username, password, email, confirmPassword } = req.body;
  /*------------------TENDRIA Q TRATAR DE HACER TODA LA VALIDATION DE UN SAQUE*/
  if (password !== confirmPassword) {
    return next(new CustomError(401, "Passwords do not match. "));
  }
  /*---NO HACE FALTA BUSCAR USER CON EMAIL PREVIAMENTE YA Q AL
        GUARDARLO AUTOMATICAMENTE MONGOOSE VA TIRAR ERROR DUPLICATE*/
  const newUser = new User({ username, password, email });
  await newUser.hashPass();
  await newUser.save();
  return res.sendStatus(201);
});

export const loginUser = errorWrapper(async (req, res, next) => {
  const cookies = req.cookies;
  const maybeLeftOverRT = cookies?.[COOKIE_RT_KEY];
  const { email, password } = req.body;

  let user = await User.findOne<IUser>({ email }).select("+password");

  const errorMessage = "Username or password do not match.";
  if (!user) {
    return next(new CustomError(401, errorMessage));
  }

  /*---------------JWT INSTANCE METHOD-------------*/
  if (await user.verifyPass(password)) {
    const accessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    const filteredRefreshTokens = !maybeLeftOverRT
      ? user.refreshToken
      : user.refreshToken.filter((rt) => rt !== maybeLeftOverRT);

    //SET REFRESH TKN COOKIE
    //do I need to delete the maybeLeftOverRT,
    res.cookie(COOKIE_RT_KEY, newRefreshToken, COOKIE_OPTIONS);

    user.refreshToken = [...filteredRefreshTokens, newRefreshToken];
    await user.save();

    const cleanUser = getCleanUser(user);

    return res.status(200).json({ user: cleanUser, accessToken });
  } else {
    return next(new Error401(errorMessage));
  }
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
