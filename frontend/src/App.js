import ROUTES from "./routes";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <Routes>
        {ROUTES.map(route => <Route path={route.path} element={route.element} key={route.path} />)}
      </Routes>
    </div>
  );
}

export default App;
