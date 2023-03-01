import classes from "./HomePage.module.css";
import NavBar from "../../components/ui/NavBar";
import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect, Fragment } from "react";
import {
  startAPIHandler,
  fetchUserInfoAPIHandler,
} from "../../utils/apiHandler";
import AuthContext from "../../store/auth-context";
import InputModal from "../../components/ui/InputModal";

const HomePage = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [patienceID, setPatienceID] = useState(null);
  const [dentistID, setDentistID] = useState(null);
  const [isStart, setIsStart] = useState(false);

  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const [isLoaded, setIsLoaded] = useState(false);

  // fetching user data, when loaded page =========================
  useEffect(() => {
    fetchUserInfoAPIHandler(token, setUserData, setIsLoaded);
  }, [token]);
  // =============================================================

  function startHandler() {
    startAPIHandler();
    navigate("/record", {
      state: {
        userData: userData,
        patienceID: patienceID,
        dentistID: dentistID,
      },
    });
  }

  const checkIsStartHandler = () => {
    setIsStart((prevcheckIsStart) => {
      return !prevcheckIsStart;
    });
  };

  function editAccountMenuOnClickHandler() {
    navigate("/account/edit");
  }

  return (
    <Fragment>
      {isStart && (
        <InputModal
          header="Please enter required information"
          modalType="input"
          setDentistID={setDentistID}
          setPatienceID={setPatienceID}
          onCancelClick={checkIsStartHandler}
          onOKClick={startHandler}
        />
      )}
      -----------------------------------------------------------------------------------------------------
      <div className="landing-page">
        <div className={classes["top-bar"]}>
          <NavBar userData={userData} isLoaded={isLoaded}></NavBar>
        </div>
        {/* </div> */}
        <div className={classes.actions}>
          <button onClick={checkIsStartHandler}>Start</button>
        </div>
        <div className={classes.actions}>
          <button onClick={editAccountMenuOnClickHandler}>Account Edit</button>
        </div>
      </div>
    </Fragment>
  );
};

export default HomePage;
