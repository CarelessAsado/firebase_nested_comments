import { setHeaders } from "API/axiosInstanceJWT";
import { LSTORAGE_KEY } from "config/constants";

export default function setHeaders_User_LStorage(data: LoginSuccessful) {
  console.log("about to set data: ", data);
  localStorage.setItem(LSTORAGE_KEY, JSON.stringify(true));
  setHeaders(data?.accessToken);
}
