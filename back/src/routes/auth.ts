import express from "express";
import { BACKEND_ENDPOINTS } from "../constants";
import * as authControllers from "../controllers/auth";

import verifyMongoUser, {
  verifyFirebaseToken,
} from "../middleware/verifyToken";

const router = express.Router();

//add RATE LIMITER
router.post(
  BACKEND_ENDPOINTS.REGISTER,
  verifyFirebaseToken,
  authControllers.registerUser
);
router.post(
  BACKEND_ENDPOINTS.LOGIN,
  verifyFirebaseToken,
  verifyMongoUser,
  authControllers.loginUser
);

module.exports = router;
