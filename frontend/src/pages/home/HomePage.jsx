import classes from "./HomePage.module.css";
import NavBar from "../../components/ui/NavBar";
import { useNavigate } from "react-router-dom";
import { startAPIHandler, editAccountAPIHandler } from "../../utils/apiHandler";

const HomePage = () => {
  const navigate = useNavigate();

  // const { state } = useLocation();
  // const { email } = state;
  function startHandler() {
    startAPIHandler();
  }

  function editAccountHandler(userEmail) {
    editAccountAPIHandler({ email: userEmail }, navigate);
  }

  return (
    <div className="landing-page">
      <NavBar email="email"></NavBar>
      <div className={classes.actions}>
        <button onClick={startHandler}>Start</button>
      </div>
      <div className={classes.actions}>
        <button onClick={editAccountHandler}>Account Edit</button>
      </div>
    </div>
  );
};

export default HomePage;
