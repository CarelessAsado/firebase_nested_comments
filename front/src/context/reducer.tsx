import { ActionsEnum } from "./actions";

export type Actions =
  | { type: ActionsEnum.START_FETCH_ALL }
  | { type: ActionsEnum.RESET_ERRORS }
  | { type: ActionsEnum.FAILURE_FETCH_ALL; payload: string }
  | { type: ActionsEnum.SUCCESS_FETCH_ALL; payload: ITarea[] }
  | { type: ActionsEnum.SUCCESS_LOGIN; payload: UserNotNull }
  | { type: ActionsEnum.LOG_OUT }
  | { type: ActionsEnum.SUCCESS_REGISTER }
  | { type: ActionsEnum.SUCCESS_POST_NEW_TASK; payload: ITarea }
  | { type: ActionsEnum.SUCCESS_UPDATE; payload: ITarea }
  | { type: ActionsEnum.SUCCESS_DELETE; payload: string };

export const taskReducer = (state: State, action: Actions) => {
  const copia: ITarea[] = [...state.tareas];
  switch (action.type) {
    /*---------------RESET ERRORS WHEN NAVIGATING BETWEEN PAGES-----------------*/
    case ActionsEnum.RESET_ERRORS:
      return {
        ...state,
        isFetching: false,
        error: false,
      };
    /*---------------LOGIN-----------------*/
    case ActionsEnum.SUCCESS_LOGIN:
      return {
        ...state,
        isFetching: false,
        user: action.payload,
      };
    /*---------------LOGOUT-----------------*/
    case ActionsEnum.LOG_OUT:
      return {
        ...state,
        isFetching: false,
        error: false,
        user: null,
      };
    /*---------------REGISTER-----------------*/
    case ActionsEnum.SUCCESS_REGISTER:
      return {
        ...state,
        isFetching: false,
        successRegister: "You have registered successfully. You can now login.",
      };
    /*------------------CREATE NEW TASK API CALL---------------------*/
    case ActionsEnum.SUCCESS_POST_NEW_TASK:
      return {
        ...state,
        isFetching: false,
        tareas: [...copia, action.payload],
      };
    /*---------------------------------------------------------*/
    /*------------------GET ALL TASKS API CALL---------------------*/
    case ActionsEnum.START_FETCH_ALL:
      return { ...state, error: false, isFetching: true, successRegister: "" };
    case ActionsEnum.FAILURE_FETCH_ALL:
      return { ...state, isFetching: false, error: action.payload };
    case ActionsEnum.SUCCESS_FETCH_ALL:
      return { ...state, isFetching: false, tareas: action.payload };
    /*---------------------------------------------------------*/
    /*------------------DELETE API CALL---------------------*/
    case ActionsEnum.SUCCESS_DELETE:
      return {
        ...state,
        isFetching: false,
        tareas: copia.filter((i: ITarea) => i._id !== action.payload),
      };
    /*-----------------------UPDATE TASK------------------------------------*/

    case ActionsEnum.SUCCESS_UPDATE:
      return {
        ...state,
        isFetching: false,
        tareas: copia.map((i: ITarea) =>
          i._id === action.payload._id ? action.payload : i
        ),
      };

    default:
      throw Error("Type does not exist.");
  }
};
