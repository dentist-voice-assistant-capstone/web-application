import classes from "./HomePage.module.css";
import NavBar from "../../components/ui/NavBar";
import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect, Fragment } from "react";
import { fetchUserInfoAPIHandler } from "../../utils/apiHandler";
import { fetchUserLatestRecordAPIHandler } from "../../utils/recordAPIHandler";
import AuthContext from "../../store/auth-context";
import InputModal from "../../components/ui/InputModal";
import Modal from "../../components/ui/Modal";
import { MAXIMUM_TIME_TO_RETRIEVE_FINISHED_RECORD } from "../../utils/constants";

const HomePage = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [patientID, setPatientID] = useState("");
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
    if (!!!latestRecordData) {
      setIsResumeButtonDisabled(true);
      return;
    }
    if (!latestRecordData.finished) {
      setIsResumeButtonDisabled(false);
      return;
    }
    // Convert timestamp to milliseconds
    const recordTimestamp = Date.parse(latestRecordData.timestamp);
    // Get the current time in milliseconds
    const currentTimestamp = new Date().getTime();
    // Calculate the difference between the current time and the timestamp
    const timeDifference = currentTimestamp - recordTimestamp;
    if (timeDifference <= MAXIMUM_TIME_TO_RETRIEVE_FINISHED_RECORD) {
      setIsResumeButtonDisabled(false);
    } else {
      setIsResumeButtonDisabled(true);
    }
  };

  const formatRecordTimeStamp = (timestamp) => {
    const date = new Date(timestamp);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hourCycle: "h23",
    };
    const formattedDateString = date.toLocaleString("en-US", options);
    return formattedDateString.replace(" at", "");
  };

  useEffect(() => {
    const fetchInformation = async (token) => {
      let userData = await fetchUserInfoAPIHandler(token);
      let latestRecordData = await fetchUserLatestRecordAPIHandler(token);
      return { userData, latestRecordData };
    };

    // fetch userData and LatestRecordData
    if (isLoggedIn) {
      fetchInformation(token)
        .then(({ userData, latestRecordData }) => {
          checkIsLatestRecordAbleToBeRestored(latestRecordData);
          setUserData(userData);
          setLatestRecordData(latestRecordData);
          setDentistID(userData.dentistID);
          setIsLoaded(true);
        })
        .catch((err) => {
          if (err.message === "Cannot connect to backend server") {
            // console.log(`${err.message}`);
          }
        });
    }
  }, []);

  function startHandler(mode = "new") {
    if (mode === "new") {
      /* start a new recording */
      navigate("/record", {
        state: {
          userData: userData,
          patientID: patientID,
          dentistID: dentistID,
          mode: mode,
        },
      });
    } else if (mode === "resume") {
      /* resume recording */
      navigate("/record", {
        state: {
          userData: userData,
          patientID: latestRecordData.patientId,
          dentistID: userData.dentistID,
          mode: mode,
          latestInformation: latestRecordData.recordData,
        },
      });
    }
  }

  const checkIsStartHandler = () => {
    if (isLoaded) {
      setDentistID(userData.dentistID);
      setPatientID("");
      setIsStart((prevcheckIsStart) => {
        return !prevcheckIsStart;
      });
    } else {
      navigate("/login");
    }
  };

  const checkIsContinueHandler = () => {
    // hide "Please enter required information" modal
    setIsStart((prevcheckIsStart) => {
      return !prevcheckIsStart;
    });
    // show "Confirm to continue" modal
    setIsContinue((prevcheckIsContinue) => {
      return !prevcheckIsContinue;
    });
  };

  const modalRecheckContent = (
    <p>
      Dentist ID: {dentistID}
      <br />
      Patient ID: {patientID}
      <br />
      Once confirmed,{" "}
      <span style={{ color: "red" }}>
        <b> this procedure cannot be reversed.</b>
      </span>
    </p>
  );

  const checkIsResumeHandler = () => {
    setIsResume((prevIsResume) => {
      return !prevIsResume;
    });
  };

  let modalResumeContent;
  if (latestRecordData) {
    modalResumeContent = (
      <div>
        <p>
          You have an unfinished record
          <br />
          Patient ID:
          <b style={{ color: "black" }}>
            {" " +
              (latestRecordData.patientId !== ""
                ? latestRecordData.patientId
                : "<unknown>")}
          </b>
          <br />
          Time:{" "}
          <b style={{ color: "black" }}>
            {" " + formatRecordTimeStamp(latestRecordData.timestamp)}
          </b>
          <br />
        </p>
        <p>
          Press <b style={{ color: "green" }}>OK</b> to resume recording
        </p>
      </div>
    );
  }

  return (
    <Fragment>
      {/* Modals */}
      {isStart && (
        <InputModal
          header="Please enter required information"
          modalType="input"
          dentistID={userData.dentistID}
          patientID={patientID}
          setDentistID={setDentistID}
          setPatientID={setPatientID}
          onCancelClick={checkIsStartHandler}
          onOKClick={checkIsContinueHandler}
        />
      )}
      {isContinue && (
        <Modal
          header="Confirm to continue"
          content={modalRecheckContent}
          onOKClick={() => {
            startHandler("new");
          }}
          onCancelClick={checkIsContinueHandler}
          okButtonText="Confirm"
          modalType="input_confirm"
        />
      )}
      {isResume && (
        <Modal
          header="Resume Recording"
          modalType="input_confirm"
          onOKClick={() => {
            startHandler("resume");
          }}
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
              This is a dentist assistance web-application developed by a group
              of Engineering students from Chulalongkorn University, for the
              purpose of educational use in Faculty of Dentistry, Chulalongkorn
              University.
            </p>
          </div>
          <div className={classes.actions}>
            {isLoggedIn && (
              <Fragment>
                <button onClick={checkIsStartHandler}>
                  Start New Recording
                </button>
                <button
                  onClick={checkIsResumeHandler}
                  disabled={isResumeButtonDisabled}
                >
                  Resume Recording
                </button>
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
