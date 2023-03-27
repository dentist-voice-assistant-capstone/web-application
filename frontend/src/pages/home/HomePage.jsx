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
import Modal from "../../components/ui/Modal";

const HomePage = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [patienceID, setPatienceID] = useState("");
  const [dentistID, setDentistID] = useState("");
  const [isStart, setIsStart] = useState(false);
  const [isContinue, setIsContinue] = useState(false);

  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const [isLoaded, setIsLoaded] = useState(false);

  // fetching user data, when loaded page =========================
  useEffect(() => {
    if (authCtx.isLoggedIn) {
      fetchUserInfoAPIHandler(token, setUserData, setIsLoaded);
    }
  }, [token]);
  // =============================================================

  console.log("userData", userData);
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
    if (isLoaded) {
      setDentistID(userData.dentistID);
      setIsStart((prevcheckIsStart) => {
        return !prevcheckIsStart;
      });

      if (!isStart && !isContinue) {
        setDentistID(userData.dentistID);
        setPatienceID("");
      }
    } else {
      navigate("/login");
    }
  };

  const checkIsContinueHandler = () => {
    checkIsStartHandler();
    setIsContinue((prevcheckIsContinue) => {
      return !prevcheckIsContinue;
    });
  };

  const modalRecheckContent = (
    <p>
      Dentist ID: {dentistID}
      <br />
      Patience ID: {patienceID}
      <br />
      Once confirmed,{" "}
      <span style={{ color: "red" }}>
        <b> this procedure cannot be reversed.</b>
      </span>
    </p>
  );

  return (
    <Fragment>
      {isStart && (
        <InputModal
          header="Please enter required information"
          modalType="input"
          dentistID={dentistID}
          patienceID={patienceID}
          setDentistID={setDentistID}
          setPatienceID={setPatienceID}
          onCancelClick={checkIsStartHandler}
          onOKClick={checkIsContinueHandler}
        />
      )}
      {isContinue && (
        <Modal
          header="Confirm to continue"
          content={modalRecheckContent}
          onOKClick={startHandler}
          onCancelClick={checkIsContinueHandler}
          okButtonText="Confirm"
          modalType="input_confirm"
        />
      )}

      <div className="landing-page">
        <div className={classes["image-section"]}>
          <div className={classes["top-bar"]}>
            <NavBar
              userData={userData}
              isLoaded={isLoaded}
              isEditEnable={true}
            ></NavBar>
          </div>
          <div>
            <h1 className={classes.header}>
              Dentist Voice-Controlled Assistant
            </h1>
            <p className={classes.information}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ante
              eros, aliquam et nisl vitae, accumsan volutpat tellus. Suspendisse
              eget pharetra magna. Donec id nibh ac elit mollis finibus. Fusce
              gravida turpis dui, vel vulputate ante scelerisque et. Ut finibus
              diam quis ultrices vulputate. Nulla sapien turpis, ullamcorper sed
              nibh a, viverra dignissim lectus. Pellentesque tincidunt imperdiet
              odio, id aliquam nunc sodales et.
            </p>
          </div>
          <div className={classes.actions}>
            <button onClick={checkIsStartHandler}>Getting Started</button>
          </div>
          {/* <div className={classes.actions}>
            <button onClick={editAccountMenuOnClickHandler}>
              Account Edit
            </button>
          </div> */}
        </div>
      </div>
    </Fragment>
  );
};

export default HomePage;
