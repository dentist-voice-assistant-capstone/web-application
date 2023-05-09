/* import React Libraries */
import { useState, useEffect, useReducer, useContext, useRef, Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/* import Custom Components */
import TopInformationBar from "../../components/record/TopInformationBar";
import RecordControlBar from "../../components/record/RecordControlBar";
import RecordInformation from "../../components/record/RecordInformation";
import Modal from "../../components/ui/Modal";
import CurrentCommandBox from "../../components/record/CurrentCommandBox";
import AuthContext from "../../store/auth-context";

/* import other components */
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Spinner from "react-bootstrap/Spinner";
import { FiCloudOff } from "react-icons/fi";

/* import css styles */
import classes from "./RecordPage.module.css";

/* import related data and functions */
import { EX_DATA, UPDATE_RECORD_EVERY_MILLISECONDS } from "../../utils/constants";
import { teethInformationHandler } from "../../utils/TeethInformationHandler";
import { getListOfMissingToothFromInformation } from "../../utils/toothLogic";
import { checkUserTokenAPIHandler } from "../../utils/apiHandler";
import { postRecordAPIHandler } from "../../utils/recordAPIHandler";

import {
  initiateConnection,
  undoToothMissing,
  addToothMissing,
  startAudioStreaming,
  stopAudioStreaming,
  terminateConnection,
} from "../../utils/socketWebRTCHandler";
import { defaultCurrentCommand, currentCommandReducer } from "../../utils/toothLogic";
import { playConnectionSound } from "../../utils/soundPlayerHandler";

const RecordPage = () => {
  const navigate = useNavigate();
  const state = useLocation();

  const authCtx = useContext(AuthContext);
  const token = authCtx.token;

  // retrieve information from state passed from the Homepage =========
  let userData = null;
  let patientID = null;
  let dentistID = null;
  let mode = null;
  let latestInformation = null;
  try {
    userData = state.state.userData;
    patientID = state.state.patientID;
    dentistID = state.state.dentistID;
    mode = state.state.mode;
    if (mode === "resume") {
      latestInformation = state.state.latestInformation
    }
  } catch (err) {
  }
  // =========== FOR TESTING ======================
  // const userData = { email: "test@hotmail.com" };
  // const patientID = "123456";
  // const dentistID = "654321";
  // ===============================================

  const current = new Date();
  const date = `${current.getDate()}/${current.getMonth() + 1
    }/${current.getFullYear()}`;

  // [States] ===============================================================
  const [userId, setUserId] = useState(null);

  /* states for socket.io connection */
  const [socket, setSocket] = useState(null);
  const [isSocketReconnecting, setIsSocketReconnecting] = useState(false);
  const [socketFailedToConnect, setSocketFailedToConnect] = useState(false);

  /* states for WebRTC Connection (streaming audio to backend) */
  const [peerConnection, setPeerConnection] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [webRTCFailedToConnect, setWebRTCFailedToConnect] = useState(false);

  /* states for checking that the connections has been successfully initiated once */
  const [isOnceConnected, setIsOnceConnected] = useState(false);

  /* states for memorizing connection lost */
  const [isNotConnected, setIsNotConnected] = useState(true);

  /* states for enable/disable streaming audio */
  const [isAudioStreaming, setIsAudioStreaming] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const pauseResumeHandler = () => {
    setIsPaused((prevIsPaused) => {
      return !prevIsPaused;
    });
  };

  /* states for teeth information */
  const defaultInformation = JSON.parse(JSON.stringify(EX_DATA));
  const startInformation = mode === "resume" ? latestInformation : defaultInformation
  const [information, setInformation] = useState([...startInformation]);

  /* state for keeping the interval id to update record */
  const updateInformationIntervalIdRef = useRef(null);
  const startUpdateInformationInterval = () => {
    console.log("start timer...")
    const id = setInterval(() => {
      console.log("timer executed...")
      postRecordAPIHandler(token, {
        patientId: patientID,
        finished: false,
        recordData: information
      })
    }, UPDATE_RECORD_EVERY_MILLISECONDS)
    updateInformationIntervalIdRef.current = id;
  }
  const stopUpdateInformationInterval = () => {
    console.log("stop timer...")
    clearInterval(updateInformationIntervalIdRef.current)
    updateInformationIntervalIdRef.current = null;
  }

  const handleSetInformation = (q, i, side, mode, target, spec_id = NaN) => {
    const newInformation = information.map((obj) => {
      return teethInformationHandler(obj, q, i, side, mode, target, spec_id);
    });
    setInformation(newInformation);

    // updated record data to database immediately ********************
    // postRecordAPIHandler(token, {
    //   patientId: patientID,
    //   finished: false,
    //   recordData: newInformation
    // });
    // ***************************************************************
  };

  const [checkFinish, setCheckFinish] = useState(false);
  const [isFinish, setIsFinish] = useState(false);

  const [currentCommand, dispatchCurrentCommand] = useReducer(
    currentCommandReducer,
    defaultCurrentCommand
  );

  /* quadrant */
  const quadrant = currentCommand.quadrant;
  const handleSelect = (e) => {
    dispatchCurrentCommand({
      type: "CHANGE_QUADRANT",
      payload: {
        quadrant: parseInt(e),
      },
    });
  };

  /* states for relogin modal */
  const [reLoginModal, setReLoginModal] = useState(null);
  const reLoginModalOKHandler = () => {
    setReLoginModal();
    authCtx.logout();
    navigate("/login");
  };

  const checkFinishHandler = () => {
    /* if click "Finish" button, if the recording is not paused, pause the recording */
    if (!isPaused) {
      pauseResumeHandler();
    }
    setCheckFinish((prevcheckFinish) => {
      return !prevcheckFinish;
    });
  };

  const confirmHandler = (latestInformation) => {
    setIsFinish(true);
    checkFinishHandler();
    stopUpdateInformationInterval();
    terminateConnection(
      socket,
      peerConnection,
      localStream,
      setSocket,
      setPeerConnection,
      setLocalStream,
      setIsAudioStreaming,
      setWebRTCFailedToConnect
    );
    navigate("/summary", {
      state: {
        information: information,
        userData: userData,
        patientID: patientID,
        dentistID: dentistID,
        date: date,
      },
    });

    // mark finished = true to the record kept in database
    postRecordAPIHandler(token, {
      patientId: patientID,
      finished: true,
      recordData: latestInformation
    })
  };

  const reconnectHandler = () => {
    setSocketFailedToConnect(false);
    initiateConnection(
      userId,
      setSocket,
      setPeerConnection,
      setLocalStream,
      setIsSocketReconnecting,
      setSocketFailedToConnect,
      setWebRTCFailedToConnect,
      setIsAudioStreaming,
      handleSetInformation,
      dispatchCurrentCommand
    );
  };

  const initializeToothTableInformation = (latestInformation) => {
    setInformation(latestInformation)
    const missingToothList = getListOfMissingToothFromInformation(latestInformation)
    // send missing tooth to backend, once reconnects
    for (const missingToothObj of missingToothList) {
      console.log("missing tooth from latestData", missingToothObj)
      addToothMissing(socket, missingToothObj.q, missingToothObj.i);
    }
  }

  // ========================================================================
  /* functions for handling add/undo tooth missing */
  const handleUndoToothMissing = (q, i) => {
    handleSetInformation(q, i, null, "Missing", false);
    undoToothMissing(socket, q, i);
  };

  const handleAddToothMissing = (q, i) => {
    handleSetInformation(q, i, null, "Missing", true);
    addToothMissing(socket, q, i);
  };
  // ========================================================================
  /* determine the socket's connection status */
  const isSocketConnected = !!socket ? socket.connected : false;

  /* determine that the connection is ready or not ? */
  const isConnectionReady =
    !!peerConnection &&
    peerConnection.connectionState === "connected" &&
    !!socket &&
    isSocketConnected;

  /* pause/resume streaming logic */
  if (isConnectionReady && !isPaused && !isAudioStreaming) {
    startAudioStreaming(socket, localStream, setIsAudioStreaming);
  } else if (isConnectionReady && isPaused && isAudioStreaming) {
    stopAudioStreaming(socket, localStream, setIsAudioStreaming);
  }

  /* displaying and changing cureentConnectionStatus logic */
  let currentConnectionStatus;
  if (isConnectionReady) {
    currentConnectionStatus = "Connected";

    if (isNotConnected) {
      // detect connected 
      if (!isOnceConnected) {
        setIsOnceConnected(true);
      }
      setIsNotConnected(false);
      initializeToothTableInformation(information);
      startUpdateInformationInterval();
      playConnectionSound(currentConnectionStatus);
    }
  } else if (!isConnectionReady && isSocketReconnecting) {
    currentConnectionStatus = "Reconnecting";
    // detect connection lost after connected 
    if (!isNotConnected) {
      setIsNotConnected(true);
      stopUpdateInformationInterval();
      playConnectionSound(currentConnectionStatus);
    }

  } else if (!isConnectionReady && (socketFailedToConnect && webRTCFailedToConnect)) {
    currentConnectionStatus = "Disconnected";
    if (!isNotConnected) {
      setIsNotConnected(true);
    }
  } else {
    currentConnectionStatus = "Unknown";
  }

  // FOR TESTING ================================================================
  // if (!!socket && !!peerConnection && !!localStream) {
  //   console.log({
  //     "peerConnection": !!peerConnection,
  //     "peerConnection.connectionState": peerConnection.connectionState,
  //     "peerConnection.iceConnectionState": peerConnection.iceConnectionState,
  //     "socket": !!socket,
  //     "isSocketConnected": isSocketConnected,
  //     "isSocketReconnecting": isSocketReconnecting,
  //     "socketFailedToConnect": socketFailedToConnect,
  //     "localStream": localStream,
  //     "isPaused": isPaused,
  //     "isAudioStreaming": isAudioStreaming,
  //     "isConnectionReady": isConnectionReady,
  //     "webRTCFailedToConnect": webRTCFailedToConnect
  //   })
  // }
  // ===========================================================================
  /* put '[]' in the second parameter of the useEffect to ensure that useEffect only runs once,
   when first render */
  useEffect(() => {
    /* when the page is loaded, instantiate the periodontal information based on the "mode" given */
    if (mode === "resume") {
      setInformation(latestInformation)
    }

    /* validate the token kept in authCtx first by sending GET request to the backend, 
      if the token is valid, it should return the associated user_id back. 
    */
    const validateToken = async () => {
      let userId = await checkUserTokenAPIHandler(token);
      return { userId }
    }
    validateToken().then(({ userId }) => {
      /* if there exists an uId associated with the token, then the user is authenticated.
       it should initiate the connection to the Backend Streaming Server via socket and webRTC.
       Otherwise, it should prompt the user to re-login again and redirect user to the login page.
      */
      if (userId) {
        console.log("userId associated with token:", userId)
        initiateConnection(
          userId,
          setSocket,
          setPeerConnection,
          setLocalStream,
          setIsSocketReconnecting,
          setSocketFailedToConnect,
          setWebRTCFailedToConnect,
          setIsAudioStreaming,
          handleSetInformation,
          dispatchCurrentCommand
        );
        setUserId(userId);
      } else {
        console.log(
          "Failed to validate token, redirecting user back to login page"
        );
        setReLoginModal({
          header: "Re-Login needed",
          content: (
            <p>
              <span style={{ color: "red" }}>
                Your session has already expired.
              </span>{" "}
              Re-login is needed. The system will redirect you to the login
              page.
            </p>
          ),
        });
      }
    });
  }, []);

  /* terminate connection, if the user press the back button on the browser */
  useEffect(() => {
    const handleBeforeUnload = () => {
      terminateConnection(
        socket,
        peerConnection,
        localStream,
        setSocket,
        setPeerConnection,
        setLocalStream,
        setIsAudioStreaming,
        setWebRTCFailedToConnect
      );
      // clear data in the table
      setInformation([...defaultInformation]);
    }
    window.addEventListener("popstate", handleBeforeUnload);
    return () => {
      console.log("clear connection from popstate...");
      stopUpdateInformationInterval();
      setTimeout(() => {
        window.removeEventListener("popstate", handleBeforeUnload);
      }, 0);
    };
  }, [socket, peerConnection, localStream, setInformation]);

  const modalConfirmContent = (
    <p>
      Are you sure to finish the recording?
      <br />
      Once saved,{" "}
      <span style={{ color: "red" }}>
        <b> this procedure cannot be reversed.</b>
      </span>
    </p>
  );

  const PDRETableComponentToBeRendered = (
    <Fragment>
      <div className={classes.current_command_box}>
        <CurrentCommandBox
          command={currentCommand.command}
          tooth={currentCommand.tooth}
        />
      </div>
      <div className={classes.droplist}>
        <DropdownButton
          className={classes.box}
          title={`Q${quadrant}`}
          onSelect={handleSelect}
        >
          <Dropdown.Item eventKey="1">Q1</Dropdown.Item>
          <Dropdown.Item eventKey="2">Q2</Dropdown.Item>
          <Dropdown.Item eventKey="3">Q3</Dropdown.Item>
          <Dropdown.Item eventKey="4">Q4</Dropdown.Item>
        </DropdownButton>
      </div>
      <div className="centered">
        {quadrant === 1 && (
          <RecordInformation
            information={information[0]}
            currentCommand={currentCommand}
            handleSetInformation={handleSetInformation}
            handleUndoToothMissing={handleUndoToothMissing}
            handleAddToothMissing={handleAddToothMissing}
          />
        )}
        {quadrant === 2 && (
          <RecordInformation
            information={information[1]}
            currentCommand={currentCommand}
            handleSetInformation={handleSetInformation}
            handleUndoToothMissing={handleUndoToothMissing}
            handleAddToothMissing={handleAddToothMissing}
          />
        )}
        {quadrant === 3 && (
          <RecordInformation
            information={information[2]}
            currentCommand={currentCommand}
            handleSetInformation={handleSetInformation}
            handleUndoToothMissing={handleUndoToothMissing}
            handleAddToothMissing={handleAddToothMissing}
          />
        )}
        {quadrant === 4 && (
          <RecordInformation
            information={information[3]}
            currentCommand={currentCommand}
            handleSetInformation={handleSetInformation}
            handleUndoToothMissing={handleUndoToothMissing}
            handleAddToothMissing={handleAddToothMissing}
          />
        )}
      </div>
      <RecordControlBar
        isPaused={isPaused}
        isFinish={!isFinish}
        pauseResumeHandler={pauseResumeHandler}
        checkFinishHandler={checkFinishHandler}
        currentConnectionStatus={currentConnectionStatus}
        reconnectHandler={reconnectHandler}
      />
    </Fragment>
  );

  const ReconnectingScreenToBeRendered = (
    <div className={`${classes["center-box"]} centered`}>
      <Spinner animation="border" variant="danger" />
      <p className={classes["waiting_text"]}>
        Connecting to the server <br /> Please Wait
      </p>
    </div>
  );

  const FailedToConnectScreenToBeRendered = (
    <div className={`${classes["center-box"]} centered`}>
      <FiCloudOff size="45px" />
      <p className={classes["waiting_text"]}>
        <span style={{ color: "red" }}>Failed to connect to the server</span>
        <br /> Please try again later.
      </p>
      <div className={classes["controls"]}>
        <button
          className={`${classes["control-button"]} ${classes["back-button"]}`}
          onClick={() => {
            navigate("/");
          }}
        >
          Back
        </button>
        <button
          className={`${classes["control-button"]} ${classes["reconnect-button"]}`}
          onClick={reconnectHandler}
        >
          Reconnect
        </button>
      </div>
    </div>
  );

  let CenterComponentToBeRendered;
  if (isOnceConnected) {
    // add true for testing
    CenterComponentToBeRendered = PDRETableComponentToBeRendered;
  } else if (!isOnceConnected && !isConnectionReady && !socketFailedToConnect) {
    CenterComponentToBeRendered = ReconnectingScreenToBeRendered;
  } else if (!isOnceConnected && !isConnectionReady && socketFailedToConnect) {
    CenterComponentToBeRendered = FailedToConnectScreenToBeRendered;
  }

  return (
    <Fragment>
      {/* Modal for confirm finish recording */}
      {checkFinish && (
        <Modal
          header="Confirm Information"
          content={modalConfirmContent}
          onOKClick={() => { confirmHandler(information) }}
          onCancelClick={checkFinishHandler}
          okButtonText="Save"
          modalType="confirm"
        />
      )}
      {/* Modal for redirect user to re-login */}
      {reLoginModal && (
        <Modal
          header={reLoginModal.header}
          content={reLoginModal.content}
          onOKClick={reLoginModalOKHandler}
          modalType="info"
        />
      )}
      <div className="landing-page">
        {/* TopInformationBar */}
        <div className={classes["top_bar"]}>
          <TopInformationBar
            date={date}
            patientID={patientID}
            dentistID={dentistID}
            isSummary={false}
          />
        </div>
        {/* test button */}
        {/* <button onClick={() => {
          // new Audio(connectedSound).play()
        }}> test</button> */}

        {/* Center */}
        {CenterComponentToBeRendered}
      </div>
    </Fragment>
  );
};
export default RecordPage;
