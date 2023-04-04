import classes from "./HomePage.module.css";
import NavBar from "../../components/ui/NavBar";
import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect, Fragment } from "react";
import {
  startAPIHandler,
  fetchUserInfoAPIHandler,
} from "../../utils/apiHandler";
import { fetchUserLatestRecordAPIHandler } from "../../utils/recordAPIHandler";
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

  const [isLoaded, setIsLoaded] = useState(false);

  const [latestRecordData, setLatestRecordData] = useState(null);
  const [isResumeButtonDisabled, setIsResumeButtonDisabled] = useState(true);

  const [isResume, setIsResume] = useState(false);

  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const isLoggedIn = authCtx.isLoggedIn;

  const checkIsLatestRecordAbleToBeRestored = (latestRecordData) => {
    if (!latestRecordData.finished) {
      setIsResumeButtonDisabled(false)
    } else {
      setIsResumeButtonDisabled(true)
    }
  }

  const formatRecordTimeStamp = (timestamp) => {
    const date = new Date(timestamp);

    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    }

    const formattedDateString = date.toLocaleString('en-US', options)
    return formattedDateString
  }

  useEffect(() => {
    const fetchInformation = async (token) => {
      let userData = await fetchUserInfoAPIHandler(token);
      let latestRecordData = await fetchUserLatestRecordAPIHandler(token);
      return { userData, latestRecordData };
    }

    // fetch userData and LatestRecordData
    if (isLoggedIn) {
      fetchInformation(token).then(({ userData, latestRecordData }) => {
        checkIsLatestRecordAbleToBeRestored(latestRecordData)
        setUserData(userData)
        setLatestRecordData(latestRecordData)
        setIsLoaded(true)
        console.log("userData:", userData)
        console.log("latestRecordData:", latestRecordData)
      }).catch((err) => {
        if (err.message === "Cannot connect to backend server") {
          console.log(`${err.message}`);
        }
      })
    }
  }, []);

  // console.log("userData", userData);

  // Start New Recording ===============================================
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
  // Resume Recording ===============================================
  const checkIsResumeHandler = () => {
    setIsResume((prevIsResume) => {
      return !prevIsResume
    })
  }

  let modalResumeContent;
  if (latestRecordData) {
    modalResumeContent = (
      <div>
        <p>
          You have an unfinished record
          <br />
          PatientID:
          <b style={{ color: "black" }}>{" " + latestRecordData.patientId || "null"}</b>
          <br />
          at
          <b style={{ color: "black" }}>{" " + formatRecordTimeStamp(latestRecordData.timestamp)}</b>
          <br />
        </p>
        <p>
          Press <b style={{ color: "green" }}>OK</b> to resume recording
        </p>
      </div>
    )
  }

  return (
    <Fragment>
      {/* Modals */}
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
      {isResume && (
        <Modal
          header="Resume Recording"
          modalType="input_confirm"
          onCancelClick={checkIsResumeHandler}
          content={modalResumeContent}
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
            {isLoggedIn && (
              <Fragment>
                <button onClick={checkIsStartHandler}>Start New Recording</button>
                <button onClick={checkIsResumeHandler} disabled={isResumeButtonDisabled}>Resume Recording</button>
              </Fragment>
            )}
            {!isLoggedIn && (
              <button onClick={checkIsStartHandler}>Getting Started</button>
            )}

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
