import { setHeaders } from "API/axiosInstanceJWT";
import { LSTORAGE_KEY } from "config/constants";
import { ActionsEnum } from "context/actions";
import { Actions } from "context/reducer";

export default function setHeaders_User_LStorage(
  dispatch: React.Dispatch<Actions>,
  data: LoginSuccessful
) {
  console.log("about to set data: ", data);
  localStorage.setItem(LSTORAGE_KEY, JSON.stringify(true));
  setHeaders(data?.accessToken);
  dispatch({
    type: ActionsEnum.SUCCESS_LOGIN,
    payload: data?.user,
  });
}
