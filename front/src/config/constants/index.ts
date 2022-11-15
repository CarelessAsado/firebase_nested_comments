class URL_FRONT_ENDPOINTS {
  LOGIN = "/login";
  REGISTER = "/register";
  FORGOT = "/forgot";
  HOME = "/";
  PROFILE = "/profile/user/:id";
  PROFILEdyn = (id: string) => {
    return "/profile/user/" + id;
  };
}
export const FRONTEND_ENDPOINTS = new URL_FRONT_ENDPOINTS();

class URL_BACK_ENDPOINTS {
  ROOT_API_VERSION = "/api/v1";
  ROOT_AUTH = `/auth`;
  LOGIN = `${this.ROOT_AUTH}/login`;
  REGISTER = `${this.ROOT_AUTH}/register`;
  REFRESH = `${this.ROOT_AUTH}/refresh`;
  LOGOUT = `${this.ROOT_AUTH}/logout`;
  USERdyn = (user_id: string) => {
    return "users/" + user_id;
  };
  UPLOADIMGdyn = (user_id: string) => `/users/profilepic/${user_id}`;
  TASKS = `/tasks`;
  COMMENTS = `/comments`;
  COMMENTS_PAGEdyn = (number: number = 1) => {
    return `${this.COMMENTS}/?page=${number}`;
  };
  SUBCOMMENTSdyn = (parentID: IParentID) =>
    `${this.COMMENTS}/subcomments/${parentID}`;
  LIKESdyn = (user_id: string, comment_id: string) => {
    return `${this.COMMENTS}/likes/${user_id}/${comment_id}`;
  };
  LIKESUSERDATAdyn = (comment_id: string) => {
    return `${this.COMMENTS}/likes/userswholiked/${comment_id}`;
  };
}
export const BACKEND_URL = new URL_BACK_ENDPOINTS();

export const BACKEND_ROOT =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://rodribook.onrender.com";

export const LSTORAGE_KEY = "user";
