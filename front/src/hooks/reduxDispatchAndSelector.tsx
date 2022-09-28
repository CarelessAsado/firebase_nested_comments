import { AppDispatch, RootState } from "context/store";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
//con Ts no se puede usar useDispatch SI USAS THUNKS, te tira error, tenés q armar un mini custom hook

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
