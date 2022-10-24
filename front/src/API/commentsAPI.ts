import { BACKEND_URL } from "config/constants";
import axios from "./axiosInstanceJWT";

/*-----------------POST NEW TASK------------*/
export const postNewComment = (newTaskInput: INewCommentInput) => {
  return axios.post<IComment>(BACKEND_URL.COMMENTS, newTaskInput);
};
/* ------------------------------------------- */
/* export const updateComment = (task: IComment, userID: string) => {
  return axios.put<IComment>(
    `${BACKEND_URL.COMMENTS}/${userID}/${task._id}`,
    task
  );
}; */
export const getComments = function (controller?: AbortController) {
  return axios.get<IComment[]>(BACKEND_URL.COMMENTS, {
    signal: controller?.signal,
  });
};
export const deleteComment = async function (obj: IComment) {
  return axios.delete<void>(
    `${BACKEND_URL.COMMENTS}/${
      typeof obj.userID === "string" ? obj.userID : obj.userID._id
    }/${obj._id}`,
    { data: obj }
  );
};
