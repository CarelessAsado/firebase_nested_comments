import { showOrCloseNotification } from "context/generalSlice";
import { AppDispatch } from "context/store";

export const dispatchNotification = (dispatch: AppDispatch, msg: string) => {
  dispatch(showOrCloseNotification(msg));
  setTimeout(() => dispatch(showOrCloseNotification("")), 2500);
  return;
};
