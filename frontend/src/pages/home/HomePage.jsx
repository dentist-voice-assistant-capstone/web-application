import classes from "./HomePage.module.css";
import NavBar from "../../components/ui/NavBar";
import { useNavigate, useLocation } from "react-router-dom";
import { startAPIHandler } from "../../utils/apiHandler";

const HomePage = () => {
  const navigate = useNavigate();

  // const { state } = useLocation();
  // const { email } = state;

  function startHandler() {
    startAPIHandler();
  }

  function editAccountMenuOnClickHandler() {
    navigate("/account/edit");
  }

  return (
    <div className="landing-page">
      <NavBar email={"email"}></NavBar>
      <div className={classes.actions}>
        <button onClick={startHandler}>Start</button>
      </div>
      <div className={classes.actions}>
        <button onClick={editAccountMenuOnClickHandler}>Account Edit</button>
      </div>
    </div>
  );
};

export default HomePage;
