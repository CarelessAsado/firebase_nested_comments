import { BACKEND_URL } from "config/constants";
import axios from "./axiosInstanceJWT";

export const API = {
  /*-----------------POST NEW TASK------------*/
  postNewTask(nameNewTask: string) {
    return axios.post<ITarea>(BACKEND_URL.tasks(), {
      name: nameNewTask,
    });
  },
  /* ------------------------------------------- */
  updateTask(task: ITarea, userID: string) {
    return axios.put<ITarea>(
      `${BACKEND_URL.tasks()}/${userID}/${task._id}`,
      task
    );
  },
  getTasks: function (controller: AbortController) {
    return axios.get<ITarea[]>(BACKEND_URL.tasks(), {
      signal: controller.signal,
    });
  },
  deleteTask: async function (id: string, userID: string) {
    return axios.delete<void>(`${BACKEND_URL.tasks()}/${userID}/${id}`);
  },
};
