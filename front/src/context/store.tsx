import { configureStore } from "@reduxjs/toolkit";
import userReducer /*, { listenerMiddleware }  */ from "./userSlice";

/* import type { TypedUseSelectorHook } from "react-redux"; */
const store = configureStore({
  reducer: {
    user: userReducer,
    /*     general: generalReducer, */
  },
  /*   middleware: (getDefaultMid) =>
    getDefaultMid().prepend(listenerMiddleware.middleware), */
});

//esto lo exporto p/el custom hook del useSelector y capaz algo +
export type RootState = ReturnType<typeof store.getState>;
export default store;
//useDispatch no se puede usar con Ts si usas Thunk, asi q tenés q hacer un custom hook, x eso exporto aca el Type del dispatch (ver doc oficial)
export type AppDispatch = typeof store.dispatch;
