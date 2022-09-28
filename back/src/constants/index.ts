import { CookieOptions } from "express";
export const FRONTEND_URL = process.env.NODE_ENV
  ? "https://amazing-wright-70ac6b.netlify.app"
  : "http://localhost:3000";

export const JWT_SECRET = process.env.JWT_SECRET as string;
export const HEADER_ACCESS_TOKEN = "auth-token";
export const COOKIE_RT_KEY = "jwtRefreshToken";
export const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 1000,
  sameSite: "none",
  secure: true,
};
export const EXPIRATION_TOKENS = {
  access: "10s",
  refresh: "1d",
  emailToken: "30m",
};

class URL_BACK_ENDPOINTS {
  ROOT = "/api/v1";
  ROOT_AUTH = `${this.ROOT}/auth`;
  ROOT_TASKS = `${this.ROOT}/tasks`;
  LOGIN = "/login";
  REGISTER = "/register";
  REFRESH = `/refresh`;
  LOGOUT = `/logout`;
}
export const BACKEND_ENDPOINTS = new URL_BACK_ENDPOINTS();
