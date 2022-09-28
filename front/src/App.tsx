import { Routes, Route, Navigate } from "react-router-dom";
import { Login, Register, Main } from "pages/Index";
import { ProtectedByAuth } from "components/middle/ProtectedByAuth";
import { PersistLogin } from "components/middle/PersistLogin";
import { Nav } from "components/Nav/Nav";
import { UserProfile } from "pages/UserProfile";
import { useInterceptor } from "hooks/useInterceptor";
import { FRONTEND_ENDPOINTS } from "config/constants";
import { useAppSelector } from "hooks/reduxDispatchAndSelector";
import { useResetErrors } from "hooks/useResetErrors";

function App() {
  const { user } = useAppSelector((state) => state.user);
  useInterceptor();
  useResetErrors();

  return (
    <>
      <Nav></Nav>
      <Routes>
        <Route
          path={FRONTEND_ENDPOINTS.LOGIN}
          element={user ? <Navigate to={FRONTEND_ENDPOINTS.HOME} /> : <Login />}
        ></Route>

        <Route
          path={FRONTEND_ENDPOINTS.REGISTER}
          element={
            user ? <Navigate to={FRONTEND_ENDPOINTS.HOME} /> : <Register />
          }
        ></Route>

        <Route element={<PersistLogin />}>
          <Route element={<ProtectedByAuth />}>
            <Route path={FRONTEND_ENDPOINTS.HOME} element={<Main />}></Route>
            <Route path="/profile/user/:id" element={<UserProfile />}></Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
