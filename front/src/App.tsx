import { Routes, Route } from "react-router-dom";
import { Login, Register, Main } from "pages/Index";
import { ProtectedByAuth } from "components/middle/ProtectedByAuth";
import { Nav } from "components/Nav/Nav";
import { UserProfile } from "pages/UserProfile";

import { FRONTEND_ENDPOINTS } from "config/constants";
import { useResetErrors } from "hooks/useResetErrors";
import { ExpelLoggedUser } from "components/middle/ExpelLoggedUser";
import { fireBaseAuth } from "services/firebaseConfig";
import { useEffect } from "react";
import { refresh } from "context/userSlice";
import { useAppDispatch } from "hooks/reduxDispatchAndSelector";

function App() {
  useResetErrors();
  const dispatch = useAppDispatch();
  useEffect(() => {
    fireBaseAuth.onAuthStateChanged(async (userData) => {
      console.log(userData);
      if (userData) {
        //esto no salta en el login
        alert("cambiazo");
        dispatch(refresh());
      } else {
        /*        setUser(null); */
      }
    });
  }, [dispatch]);

  return (
    <>
      <Nav></Nav>
      <Routes>
        <Route element={<ExpelLoggedUser />}>
          <Route path={FRONTEND_ENDPOINTS.LOGIN} element={<Login />} />

          <Route path={FRONTEND_ENDPOINTS.REGISTER} element={<Register />} />
        </Route>

        <Route element={<ProtectedByAuth />}>
          <Route path={FRONTEND_ENDPOINTS.HOME} element={<Main />}></Route>
          <Route
            path={FRONTEND_ENDPOINTS.PROFILE}
            element={<UserProfile />}
          ></Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
