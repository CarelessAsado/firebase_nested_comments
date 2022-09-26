import { createSlice /* , createAsyncThunk */ } from "@reduxjs/toolkit";

const initialState: State = {
  user: null,
  loading: false,
  successRegister: "",
  tareas: [],
  error: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    startAction: (state) => {
      state.loading = true;
      state.error = false;
      state.successRegister = "";
    } /* la uso cuando quiero cancelar loading simplemente*/,
    clearError: (state) => {
      state.error = false;
      state.loading = false;
    },
    /* ----------ERROR------------------------ */
    failureCheckOut: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    successRegister: (state) => {
      state.loading = false;
      state.successRegister =
        "Te registraste exitosamente. Ahora podés iniciar sesión.";
    },
    /*---------CUANDO FETCHEO PROFILE USO esta tmb-*/
    successLogin: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    successLogout: (state) => {
      state.user = initialState.user;
      state.loading = initialState.loading;
      state.tareas = initialState.tareas;
      state.error = initialState.error;
    },

    /* ahora solo uso un update p/compra, antes cancelaba aparte x ej */
    successUpdateCompra: (state, action) => {},

    addCarrito: (state, action) => {},

    removeItemCarrito: (state, action) => {},

    //useEffect en APP.JSX garantiza q no se pierdan los datos al actualizar la pagina
    addDatosCompra: (state, action) => {},

    //BORRAMOS EL CARRITO y compra y agregamos la _id de la compra al array de compras del user
    //El useEffect en APP.jsx se encarga de borrar el LSTORAGE
    successConfirmedOrder: (state, action) => {},

    successGetProducts: (state, action) => {},
    successDeleteFullProducto: (state, action) => {},
  },
  extraReducers: {},
});
export const {
  startAction,
  clearError,
  failureCheckOut,
  /* -----AUTH-------- */
  successRegister,
  successLogin,
  successLogout,
  /* ---carrito methods, ahora solo hay 1 add */
  addCarrito,
  removeItemCarrito,
  /* ---------------------------------------- */
  addDatosCompra,
  successConfirmedOrder,
  /* updating COMPRA */
  successUpdateCompra,
  /* -------------- */
  successDeleteFullProducto,
  successGetProducts,
} = userSlice.actions;

export default userSlice.reducer;
