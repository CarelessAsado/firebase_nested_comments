import { Routes, Route } from "react-router-dom";
import { Login, Register, Main } from "pages/Index";
import { ProtectedByAuth } from "components/middle/ProtectedByAuth";
import { PersistLogin } from "components/middle/PersistLogin";
import { Nav } from "components/Nav/Nav";
import { UserProfile } from "pages/UserProfile";
import { useInterceptor } from "hooks/useInterceptor";
import { FRONTEND_ENDPOINTS } from "config/constants";
import { useResetErrors } from "hooks/useResetErrors";
import { ExpelLoggedUser } from "components/middle/ExpelLoggedUser";

function App() {
  useInterceptor();
  useResetErrors();

  return (
    <>
      <Nav></Nav>
      <Routes>
        <Route element={<PersistLogin />}>
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
        </Route>
      </Routes>
    </>
  );
}

export default App;
