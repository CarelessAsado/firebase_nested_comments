import { createSlice, createAsyncThunk, isPending } from "@reduxjs/toolkit";
import * as authAPI from "API/authAPI";
import * as userAPI from "API/user";
import * as commentsAPI from "API/commentsAPI";
import { setHeaders } from "API/axiosInstanceJWT";
import errorHandler from "./errorHandler";
import { fireBaseAuth } from "services/firebaseConfig";
import reauthenticateSpecialOps from "services/reauthenticateEspecialOps";
import { PasswordsInputType } from "pages/UserProfile/auxiliaries/ContactoContainer";

import { socket } from "pages/main/Main";
import { AppDispatch, RootState } from "./store";
const initialState: State = {
  user: null,
  loading: false,
  tareas: [],
  error: false,
};

export const login = createAsyncThunk(
  "users/login",
  async (input: ILoginInput, { dispatch }) => {
    try {
      const firebaseData = await authAPI.loginF(input);
      console.log(firebaseData, "LOGIN SUCCESFUL");
      /* SET HEADER USER AND LSTORAGE  */
      const idtoken = await fireBaseAuth.currentUser?.getIdToken(true);
      setHeaders(idtoken);
      const { data } = await authAPI.loginNode();

      return data.user;
    } catch (error: any) {
      await errorHandler(error, dispatch);
      //este error lo tiro xq si hago el unwrap en el front voy directo al .then()
      throw error;
    }
  }
);

export const register = createAsyncThunk(
  "users/register",
  async function (input: IRegisterInput, { dispatch }) {
    let saved = false;
    try {
      const firebaseData = await authAPI.registerFireBase(input);
      saved = true;
      console.log(firebaseData, 999);
      const idtoken = await fireBaseAuth.currentUser?.getIdToken(true);

      setHeaders(idtoken);
      const { data } = await authAPI.registerNode(input);
      console.log(data);

      return data;
    } catch (error: any) {
      //Mongo failed, so we delete firebase user
      if (saved) {
        await reauthenticateSpecialOps();
        await authAPI.deleteProfile();
      }
      //ANTIGUAMENTE mz parecía q si ponías 'return' en vez de 'throw' salía x EL builder.FULFILLED, pero ahora testeé y el catch lo agarra perfecto en el component
      //FLOW DEL ERROR => arranca aca
      //                => se va para el builder.add
      //              => dsp p el builder.match
      //              => x ultimo pasa x el .catch (ahi en ese ultimo paso, es donde tiene sentido poner acá el rejectWithValue, p/poder tener acceso al custom error COMPLETOOOO. En el builder podés tener acceso al error string, lo cual es una japa, xq dependiendo del tipo de error, yo accedo de manera diferente al string, x ej, si no hay internet, uso error.message, pero si uso error.message con axios, me salta el error x default q implica el statusCode)
      /* IMPORTANT, rejectWithValue si queres catcharlo dentro del builder, SI O SI, tenés q mandar un string, si mandas el entire object te salta error, ver : https://stackoverflow.com/questions/73259876/a-non-serializable-value-was-detected-in-an-action  */
      errorHandler(error, dispatch);
      //este error lo tiro xq si hago el unwrap en el front voy directo al .then()
      throw error;
    }
  }
);

export const updatePwd = createAsyncThunk(
  "users/updatepwd",
  async function (passwords: PasswordsInputType, { dispatch }) {
    try {
      await reauthenticateSpecialOps(passwords.oldPwd);

      //vuelve undefined la respuesta
      await authAPI.updatePwdFirebase(passwords.newPwd);
    } catch (error: any) {
      //ANTIGUAMENTE mz parecía q si ponías 'return' en vez de 'throw' salía x EL builder.FULFILLED, pero ahora testeé y el catch lo agarra perfecto en el component
      //FLOW DEL ERROR => arranca aca
      //                => se va para el builder.add
      //              => dsp p el builder.match
      //              => x ultimo pasa x el .catch (ahi en ese ultimo paso, es donde tiene sentido poner acá el rejectWithValue, p/poder tener acceso al custom error COMPLETOOOO. En el builder podés tener acceso al error string, lo cual es una japa, xq dependiendo del tipo de error, yo accedo de manera diferente al string, x ej, si no hay internet, uso error.message, pero si uso error.message con axios, me salta el error x default q implica el statusCode)
      /* IMPORTANT, rejectWithValue si queres catcharlo dentro del builder, SI O SI, tenés q mandar un string, si mandas el entire object te salta error, ver : https://stackoverflow.com/questions/73259876/a-non-serializable-value-was-detected-in-an-action  */
      errorHandler(error, dispatch);
      //este error lo tiro xq si hago el unwrap en el front voy directo al .then()
      throw error;
    }
  }
);

export const updateEmail = createAsyncThunk(
  //cambiar dsp a emmail y returnear data asi actualizo state con nuevo email
  //poner el require recent login
  "users/login",
  async function (user: UserNotNull, { dispatch }) {
    try {
      await reauthenticateSpecialOps();

      //vuelve undefined la respuesta, = q updatepwd
      await authAPI.updateEmailFirebase(user.email);

      //MONGO
      const { data } = await authAPI.updateUserNode(user);
      return data;
    } catch (error: any) {
      //ANTIGUAMENTE mz parecía q si ponías 'return' en vez de 'throw' salía x EL builder.FULFILLED, pero ahora testeé y el catch lo agarra perfecto en el component
      //FLOW DEL ERROR => arranca aca
      //                => se va para el builder.add
      //              => dsp p el builder.match
      //              => x ultimo pasa x el .catch (ahi en ese ultimo paso, es donde tiene sentido poner acá el rejectWithValue, p/poder tener acceso al custom error COMPLETOOOO. En el builder podés tener acceso al error string, lo cual es una japa, xq dependiendo del tipo de error, yo accedo de manera diferente al string, x ej, si no hay internet, uso error.message, pero si uso error.message con axios, me salta el error x default q implica el statusCode)
      /* IMPORTANT, rejectWithValue si queres catcharlo dentro del builder, SI O SI, tenés q mandar un string, si mandas el entire object te salta error, ver : https://stackoverflow.com/questions/73259876/a-non-serializable-value-was-detected-in-an-action  */
      errorHandler(error, dispatch);
      //este error lo tiro xq si hago el unwrap en el front voy directo al .then()
      throw error;
    }
  }
);

export const updateUsername = createAsyncThunk(
  //cambiar dsp a emmail y returnear data asi actualizo state con nuevo email
  //poner el require recent login
  "users/login",
  async function (user: UserNotNull, { dispatch }) {
    try {
      //MONGO
      const { data } = await authAPI.updateUserNode(user);
      return data;
    } catch (error: any) {
      //ANTIGUAMENTE mz parecía q si ponías 'return' en vez de 'throw' salía x EL builder.FULFILLED, pero ahora testeé y el catch lo agarra perfecto en el component
      //FLOW DEL ERROR => arranca aca
      //                => se va para el builder.add
      //              => dsp p el builder.match
      //              => x ultimo pasa x el .catch (ahi en ese ultimo paso, es donde tiene sentido poner acá el rejectWithValue, p/poder tener acceso al custom error COMPLETOOOO. En el builder podés tener acceso al error string, lo cual es una japa, xq dependiendo del tipo de error, yo accedo de manera diferente al string, x ej, si no hay internet, uso error.message, pero si uso error.message con axios, me salta el error x default q implica el statusCode)
      /* IMPORTANT, rejectWithValue si queres catcharlo dentro del builder, SI O SI, tenés q mandar un string, si mandas el entire object te salta error, ver : https://stackoverflow.com/questions/73259876/a-non-serializable-value-was-detected-in-an-action  */
      errorHandler(error, dispatch);
      //este error lo tiro xq si hago el unwrap en el front voy directo al .then()
      throw error;
    }
  }
);
export const uploadImg = createAsyncThunk(
  //cambiar dsp a emmail y returnear data asi actualizo state con nuevo email
  //poner el require recent login
  "users/login",
  async function (obj: { user: UserNotNull; img: FormData }, { dispatch }) {
    try {
      const { data } = await userAPI.uploadImage(obj.img, obj.user);
      return data;
    } catch (error: any) {
      //ANTIGUAMENTE mz parecía q si ponías 'return' en vez de 'throw' salía x EL builder.FULFILLED, pero ahora testeé y el catch lo agarra perfecto en el component
      //FLOW DEL ERROR => arranca aca
      //                => se va para el builder.add
      //              => dsp p el builder.match
      //              => x ultimo pasa x el .catch (ahi en ese ultimo paso, es donde tiene sentido poner acá el rejectWithValue, p/poder tener acceso al custom error COMPLETOOOO. En el builder podés tener acceso al error string, lo cual es una japa, xq dependiendo del tipo de error, yo accedo de manera diferente al string, x ej, si no hay internet, uso error.message, pero si uso error.message con axios, me salta el error x default q implica el statusCode)
      /* IMPORTANT, rejectWithValue si queres catcharlo dentro del builder, SI O SI, tenés q mandar un string, si mandas el entire object te salta error, ver : https://stackoverflow.com/questions/73259876/a-non-serializable-value-was-detected-in-an-action  */
      errorHandler(error, dispatch);
      //este error lo tiro xq si hago el unwrap en el front voy directo al .then()
      throw error;
    }
  }
);

export const forgotPwd = createAsyncThunk(
  "users/updatepwd",
  async function (email: string, { dispatch }) {
    try {
      //it returns undefined
      await authAPI.forgotPwd(email);
    } catch (error: any) {
      //ANTIGUAMENTE mz parecía q si ponías 'return' en vez de 'throw' salía x EL builder.FULFILLED, pero ahora testeé y el catch lo agarra perfecto en el component
      //FLOW DEL ERROR => arranca aca
      //                => se va para el builder.add
      //              => dsp p el builder.match
      //              => x ultimo pasa x el .catch (ahi en ese ultimo paso, es donde tiene sentido poner acá el rejectWithValue, p/poder tener acceso al custom error COMPLETOOOO. En el builder podés tener acceso al error string, lo cual es una japa, xq dependiendo del tipo de error, yo accedo de manera diferente al string, x ej, si no hay internet, uso error.message, pero si uso error.message con axios, me salta el error x default q implica el statusCode)
      /* IMPORTANT, rejectWithValue si queres catcharlo dentro del builder, SI O SI, tenés q mandar un string, si mandas el entire object te salta error, ver : https://stackoverflow.com/questions/73259876/a-non-serializable-value-was-detected-in-an-action  */
      errorHandler(error, dispatch);
      //este error lo tiro xq si hago el unwrap en el front voy directo al .then()
      throw error;
    }
  }
);
// creo q el refresh ya no es necesario, ni los interceptors
export const refresh = createAsyncThunk(
  "users/login", //uso mismo id login
  async function (_, { dispatch }) {
    try {
      const idtoken = await fireBaseAuth.currentUser?.getIdToken(true);

      setHeaders(idtoken);
      const { data } = await authAPI.loginNode();
      console.log(data, "user returned from Node");
      return data.user;
    } catch (error) {
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
      socket?.disconnect();
      setHeaders();
    } catch (error) {
      errorHandler(error, dispatch);
      //este error lo tiro xq si hago el unwrap en el front voy directo al .then()
      throw error;
    }
  }
);

/* ------------------------COMMENTS SUCCESS ACTIONS--------------------- */

export const userSlice = createSlice({
  name: "user",
  initialState,
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
      state.user = action.payload;
      state.loading = false;
    });
    //el register setea user directamente, ver si hice los headers tmb
    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });

    //logout

    builder.addCase(logout.fulfilled, (state, action) => {
      state.loading = initialState.loading;
      state.user = initialState.user;
      state.tareas = initialState.tareas;
    });

    builder.addCase(updatePwd.fulfilled, (state, action) => {
      state.error = false;
      state.loading = false;
    });

    /* -----------------------------------ADDMATCHER PENDING----------------------------------- */
    // .addMatcher tiene q ir DSP de los addCase, si lo ponés antes no ANDA
    //Lo uso como default case p/loading
    //https://redux-toolkit.js.org/api/createReducer#builderaddmatcher
    //calculo q si queres overridear el matcher tenés q agregar otro dsp no?
    // matcher can be defined outside as a type predicate function
    builder.addMatcher(isPending, (state, action) => {
      state.loading = true;
      state.error = false;
    });
  },
});

export const { renderError, resetError } = userSlice.actions;

export default userSlice.reducer;
