import { Routes, Route } from "react-router-dom";
import { Login, Register, Main } from "pages/Index";
import { ProtectedByAuth } from "components/middle/ProtectedByAuth";
import { Nav } from "components/Nav/Nav";

import { FRONTEND_ENDPOINTS } from "config/constants";
import { useResetErrors } from "hooks/useResetErrors";
import { ExpelLoggedUser } from "components/middle/ExpelLoggedUser";
import { fireBaseAuth } from "services/firebaseConfig";
import { useEffect, useState } from "react";
import { refresh } from "context/userSlice";
import { useAppDispatch, useAppSelector } from "hooks/reduxDispatchAndSelector";
import { ForgotPwd } from "pages/auth/ForgotPwd";
import { UserProfile } from "pages/UserProfile/UserProfile";
import { Notification } from "components/Notification";
import FullPageLoader from "components/loaders/FullPageLoader";
import { ChatLayout } from "components/middle/ChatLayout";

function App() {
  useResetErrors();

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    fireBaseAuth.onAuthStateChanged(async (userData) => {
      console.log(userData);
      if (userData) {
        //esto no salta en el login, pero sí salta en el register
        dispatch(refresh())
          .unwrap()
          .then(() => {
            return setLoading(false);
          });
      } else {
        //al hacer logout paso x aca
        /*        setUser(null); */
        setLoading(false);
      }
    });
  }, [dispatch]);

  if (loading) {
    return <FullPageLoader />;
  }
  return (
    <>
      <Nav />
      <Notification />
      <Routes>
        <Route element={<ExpelLoggedUser />}>
          <Route path={FRONTEND_ENDPOINTS.LOGIN} element={<Login />} />
          <Route path={FRONTEND_ENDPOINTS.FORGOT} element={<ForgotPwd />} />

          <Route path={FRONTEND_ENDPOINTS.REGISTER} element={<Register />} />
        </Route>

        <Route element={<ProtectedByAuth />}>
          {/* ChatLayout contains all the io functionality + the sidebar */}
          <Route element={<ChatLayout />}>
            <Route path={FRONTEND_ENDPOINTS.HOME} element={<Main />}></Route>
            <Route
              path={FRONTEND_ENDPOINTS.PROFILE}
              element={<UserProfile />}
            ></Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
