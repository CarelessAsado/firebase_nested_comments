import express from "express";
import { BACKEND_ENDPOINTS } from "../constants";
import * as authControllers from "../controllers/auth";

const router = express.Router();

//add RATE LIMITER
router.post(BACKEND_ENDPOINTS.REGISTER, authControllers.registerUser);
router.post(BACKEND_ENDPOINTS.LOGIN, authControllers.loginUser);
router.get(BACKEND_ENDPOINTS.REFRESH, authControllers.refreshMyToken);
router.get(BACKEND_ENDPOINTS.LOGOUT, authControllers.logout);

module.exports = router;
