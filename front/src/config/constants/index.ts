class URL_FRONT_ENDPOINTS {
  LOGIN = "/login";
  REGISTER = "/register";
  HOME = "/";
}
export const FRONTEND_ENDPOINTS = new URL_FRONT_ENDPOINTS();

class URL_BACK_ENDPOINTS {
  ROOT = "/api/v1";
  ROOT_AUTH = `/auth`;
  LOGIN = `${this.ROOT_AUTH}/login`;
  REGISTER = `${this.ROOT_AUTH}/register`;
  REFRESH = `${this.ROOT_AUTH}/refresh`;
  LOGOUT = `${this.ROOT_AUTH}/logout`;
  TASKS = `/tasks`;
}
export const BACKEND_URL = new URL_BACK_ENDPOINTS();
/* export const BACKEND_URL = {
  auth: "/auth",
  login() {
    return `${this.auth}/login`;
  },
  logout() {
    return `${this.auth}/logout`;
  },
  register() {
    return `${this.auth}/register`;
  },
  refresh() {
    return `${this.auth}/refresh`;
  },
  tasks() {
    return "/tasks";
  },
}; */
export const BACKEND_ROOT =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api/v1"
    : "https://typescript-backend-reactnode.herokuapp.com/api/v1";

export const LSTORAGE_KEY = "user";
