import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { TareaContextProvider } from "context/context";
import GlobalStyle from "Global styles/Globalstyle";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  /* desactive StrictMode xq generaba double render y hacia 2 llamadas al refresh API con el mismo token, por ende me vaciaba los refreshTokens y me logueaba out. Quise usar AbortController en la cleanup del PersistLogin, pero x alguna razon me cancelaba las dos calls, no andaba. Encima era raro q ademas de cancelar las calls, las calls llegaban al backend,AMBAS, solo q no volvian */
  <>
    <GlobalStyle />
    <BrowserRouter>
      <TareaContextProvider>
        <App />
      </TareaContextProvider>
    </BrowserRouter>
  </>
);
