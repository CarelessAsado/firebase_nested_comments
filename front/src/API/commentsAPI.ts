import { BACKEND_URL } from "config/constants";
import axios from "./axiosInstanceJWT";

/*-----------------POST NEW COMMENT------------*/
export const postNewComment = (newTaskInput: INewCommentInput) => {
  return axios.post<IComment>(BACKEND_URL.COMMENTS, newTaskInput);
};

type FacetResponse = { commentsData: IComment[]; count: number };

export const getComments = function (controller?: AbortController) {
  return axios.get<FacetResponse>(BACKEND_URL.COMMENTS, {
    signal: controller?.signal,
  });
};

export const getSubComments = function (lastComment: IComment) {
  return axios.post<FacetResponse>(
    BACKEND_URL.SUBCOMMENTSdyn(lastComment.parentID),
    lastComment
  );
};

export const deleteComment = async function (obj: IComment) {
  return axios.delete<void>(
    `${BACKEND_URL.COMMENTS}/${
      typeof obj.userID === "string" ? obj.userID : obj.userID._id
    }/${obj._id}`,
    { data: obj }
  );
};
export const likeUnlikeComment = async function (obj: IComment, user: IUser) {
  return axios.put<IComment>(BACKEND_URL.LIKESdyn(user?._id || "", obj._id));
};

export const getLikesUserData = function (comment: IComment) {
  return axios.post(BACKEND_URL.LIKESUSERDATAdyn(comment._id), comment.likes);
};

export const customApiCall = async function <TData>({
  body,
  method,
  url,
}: {
  body: {};
  method: AxiosMethodsCustomApiCall;
  url: string;
}) {
  return axios[method]<TData>(url, body);
};
