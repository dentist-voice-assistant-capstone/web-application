import { ROUTES, ROUTES_NOT_LOGIN } from "./routes";
import { Routes, Route } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "./store/auth-context";

function App() {
  const authCtx = useContext(AuthContext);

  return (
    <div>
      {authCtx.isLoggedIn && (
        <Routes>
          {ROUTES.map((route) => (
            <Route path={route.path} element={route.element} key={route.path} />
          ))}
        </Routes>
      )}
      {!authCtx.isLoggedIn && (
        <Routes>
          {ROUTES_NOT_LOGIN.map((route) => (
            <Route path={route.path} element={route.element} key={route.path} />
          ))}
        </Routes>
      )}
    </div>
  );
}

export default App;
