import classes from "./HomePage.module.css";
import NavBar from "../../components/ui/NavBar";
import { startAPIHandler, editAccountAPIHandler } from "../../utils/apiHandler";

const HomePage = () => {
  // const { state } = useLocation();
  // const { email } = state;
  function startHandler() {
    startAPIHandler();
  }

  function editAccountHandler(userEmail) {
    editAccountAPIHandler({ email: userEmail });
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
