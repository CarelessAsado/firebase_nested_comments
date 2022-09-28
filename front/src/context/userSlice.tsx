import { createSlice, createAsyncThunk, isPending } from "@reduxjs/toolkit";
import * as authAPI from "API/authAPI";
import { setHeaders } from "API/axiosInstanceJWT";
import { tasksAPI } from "API/tasksAPI";
import { LSTORAGE_KEY } from "config/constants";
import setHeaders_User_LStorage from "config/utils/setHeadersAndUsers";
import errorHandler from "./errorHandler";
const initialState: State = {
  user: null,
  loading: false,
  successRegister: "",
  tareas: [],
  error: false,
};

export const login = createAsyncThunk(
  "users/login",
  async (input: ILoginInput, { dispatch }) => {
    try {
      const { data } = await authAPI.login(input);
      console.log(data, "LOGIN SUCCESFUL");
      /* SET HEADER USER AND LSTORAGE  */
      setHeaders_User_LStorage(data);
      return data;
    } catch (error: any) {
      await errorHandler(error, dispatch);
      //este error lo tiro xq si hago el unwrap en el front voy directo al .then()
      throw error;
    }
  }
);
export const getTasks = createAsyncThunk(
  "users/getTasks",
  async function (_, { dispatch }) {
    try {
      const { data } = await tasksAPI.getTasks();
      console.log("volvio la data, vamos a despachar success fetch all");
      return data;
    } catch (error) {
      errorHandler(error, dispatch);
      //este error lo tiro xq si hago el unwrap en el front voy directo al .then()
      throw error;
    }
  }
);
export const postNewTasks = createAsyncThunk(
  "users/postNewTasks",
  async function (nameNewTask: string, { dispatch }) {
    try {
      const { data } = await tasksAPI.postNewTask(nameNewTask);
      console.log("volvio la data, vamos a despachar success fetch all");
      return data;
    } catch (error) {
      await errorHandler(error, dispatch);
      //este error lo tiro xq si hago el unwrap en el front voy directo al .then()
      throw error;
    }
  }
);

export const deleteTasks = createAsyncThunk(
  "users/deleteTasks",
  async function (obj: { id: string; userID: string }, { dispatch }) {
    try {
      await tasksAPI.deleteTask(obj.id, obj.userID);
      return obj.id;
    } catch (error) {
      await errorHandler(error, dispatch);
      //este error lo tiro xq si hago el unwrap en el front voy directo al .then()
      throw error;
    }
  }
);

export const updateTasks = createAsyncThunk(
  "users/updateTasks",
  async function (obj: { task: ITarea; userID: string }, { dispatch }) {
    try {
      const { data } = await tasksAPI.updateTask(obj.task, obj.userID);
      return data;
    } catch (error) {
      await errorHandler(error, dispatch);
      //este error lo tiro xq si hago el unwrap en el front voy directo al .then()
      throw error;
    }
  }
);

export const refresh = createAsyncThunk(
  "users/login", //uso mismo id login
  async function (_, { dispatch }) {
    try {
      //dejar de recibir accessToken en HEADERS AXIOS
      const { data } = await authAPI.refresh();
      console.log(data, "REFRESH SUCCESFUL");
      //Pensaba pasarlo a un useEffect pero al final lo dejo asi
      /* SET HEADER USER AND LSTORAGE  */
      setHeaders_User_LStorage(data);
      return data;
    } catch (error) {
      await errorHandler(error, dispatch);
      //este error lo tiro xq si hago el unwrap en el front voy directo al .then()
      throw error;
    }
  }
);
export const register = createAsyncThunk(
  "users/register",
  async function (input: IRegisterInput, { dispatch }) {
    try {
      await authAPI.register(input);
    } catch (error: any) {
      //ANTIGUAMENTE mz parecía q si ponías 'return' en vez de 'throw' salía x EL builder.FULFILLED, pero ahora testeé y el catch lo agarra perfecto en el component
      //FLOW DEL ERROR => arranca aca
      //                => se va para el builder.add
      //              => dsp p el builder.match
      //              => x ultimo pasa x el .catch (ahi en ese ultimo paso, es donde tiene sentido poner acá el rejectWithValue, p/poder tener acceso al custom error COMPLETOOOO. En el builder podés tener acceso al error string, lo cual es una japa, xq dependiendo del tipo de error, yo accedo de manera diferente al string, x ej, si no hay internet, uso error.message, pero si uso error.message con axios, me salta el error x default q implica el statusCode)
      /* IMPORTANT, rejectWithValue si queres catcharlo dentro del builder, SI O SI, tenés q mandar un string, si mandas el entire object te salta error, ver : https://stackoverflow.com/questions/73259876/a-non-serializable-value-was-detected-in-an-action  */
      await errorHandler(error, dispatch);
      //este error lo tiro xq si hago el unwrap en el front voy directo al .then()
      throw error;
    }
  }
);

export const logout = createAsyncThunk(
  "users/logout",
  async function (_, { dispatch }) {
    try {
      await authAPI.logout();
      setHeaders();
      localStorage.removeItem(LSTORAGE_KEY);
    } catch (error) {
      errorHandler(error, dispatch);
      //este error lo tiro xq si hago el unwrap en el front voy directo al .then()
      throw error;
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    /* ----------ERROR------------------------ */
    renderError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    //reseteo el error al cambiar la url/location.pathname, capaz dsp lo quite
    resetError: (state) => {
      state.loading = false;
      state.error = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.loading = false;
    });

    builder.addCase(getTasks.fulfilled, (state, action) => {
      state.tareas = action.payload;
      state.loading = false;
    });
    builder.addCase(postNewTasks.fulfilled, (state, action) => {
      state.tareas = [...state.tareas, action.payload];
      state.loading = false;
    });
    builder.addCase(deleteTasks.fulfilled, (state, action) => {
      state.tareas = state.tareas.filter((i) => i._id !== action.payload);
      state.loading = false;
    });
    builder.addCase(updateTasks.fulfilled, (state, action) => {
      state.tareas = state.tareas.map((i) =>
        i._id === action.payload._id ? action.payload : i
      );
      state.loading = false;
    });

    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = false;
      state.successRegister =
        "You have registered successfully. You can now login.";
    });

    builder.addCase(logout.fulfilled, (state, action) => {
      state.loading = initialState.loading;
      state.user = initialState.user;
      state.tareas = initialState.tareas;
      state.successRegister = initialState.successRegister;
    });

    // .addMatcher tiene q ir DSP de los addCase, si lo ponés antes no ANDA
    //Lo uso como default case p/loading
    //https://redux-toolkit.js.org/api/createReducer#builderaddmatcher
    //calculo q si queres overridear el matcher tenés q agregar otro dsp no?
    // matcher can be defined outside as a type predicate function
    builder.addMatcher(isPending, (state, action) => {
      console.log(action, 666);

      state.loading = true;
      state.error = false;
      state.successRegister = "";
    });
  },
});

export const { renderError, resetError } = userSlice.actions;

export default userSlice.reducer;
