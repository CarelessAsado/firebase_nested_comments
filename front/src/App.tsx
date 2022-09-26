import { Routes, Route, Navigate } from "react-router-dom";
import { Login, Register, Main } from "pages/Index";
import { useTareasGlobalContext } from "hooks/useTareasGlobalContext";
import { ProtectedByAuth } from "components/ProtectedByAuth";
import { PersistLogin } from "components/PersistLogin";
import { Nav } from "components/Nav/Nav";
import { UserProfile } from "pages/UserProfile";
import { useInterceptor } from "hooks/useInterceptor";
import { FRONTEND_ENDPOINTS } from "config/constants";

function App() {
  const { user } = useTareasGlobalContext();
  useInterceptor();

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
