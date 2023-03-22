/* import React Libraries */
import { useState, useEffect, useReducer, Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/* import React Components */
import TopInformationBar from "../../components/record/TopInformationBar";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import RecordControlBar from "../../components/record/RecordControlBar";
import RecordInformation from "../../components/record/RecordInformation";
import Spinner from "react-bootstrap/Spinner";
import { FiCloudOff } from "react-icons/fi";
import Modal from "../../components/ui/Modal";
import CurrentCommandBox from "../../components/record/CurrentCommandBox";

/* import css styles */
import classes from "./RecordPage.module.css";

/* import related data and functions */
import { EX_DATA } from "../../utils/constants";
import { teethInformationHandler } from "../../utils/TeethInformationHandler";

import {
  initiateConnection,
  undoToothMissing,
  addToothMissing,
  startAudioStreaming,
  stopAudioStreaming,
  terminateConnection,
} from "../../utils/socketWebRTCHandler";
import { getToothStartPosition } from "../../utils/toothLogic";

const defaultCurrentCommand = {
  command: null,
  tooth: null,
  side: null,
  position: null,
  quadrant: 1,
};

const currentCommandReducer = (prevCommand, action) => {
  switch (action.type) {
    case "CLEAR_COMMAND":
      return defaultCurrentCommand;
    case "UPDATE_COMMAND":
      // if the quadrant is changed, then set new quadrant
      let quadrant = prevCommand.quadrant;
      if (!!action.payload.tooth) {
        let newQuadrant = parseInt(action.payload.tooth.slice(0, 1));
        quadrant = newQuadrant;
      }
      return { ...action.payload, quadrant };

    case "NEXT_TOOTH":
      if (!!!action.payload.next_tooth) {
        return prevCommand;
      }
      let position = null;
      if (action.payload.mode === "RE") {
        position = getToothStartPosition(
          action.payload.next_tooth.q,
          action.payload.next_tooth.i,
          prevCommand.side
        );
      }

      let nextToothCommand = {
        command: prevCommand.command,
        tooth:
          action.payload.next_tooth.q.toString() +
          action.payload.next_tooth.i.toString(),
        side: prevCommand.side,
        position: position,
        quadrant: action.payload.next_tooth.q,
      };
      return nextToothCommand;
    case "UPDATE_PDRE_POSITION":
      /* this action will work when the system receive the RE value of 
        the latest tooth position
      */
      if (
        prevCommand.command !== "PDRE" ||
        !!!prevCommand.side ||
        !!!prevCommand.tooth ||
        !!!prevCommand.position ||
        !!!action.payload ||
        !!!action.payload.tooth ||
        !!!action.payload.side ||
        !!!action.payload.position
      ) {
        return prevCommand;
      }

      let tooth = prevCommand.tooth;
      let q = parseInt(tooth.slice(0, 1));
      let currentSide = prevCommand.side.toLowerCase();
      let currentPosition = prevCommand.position.toLowerCase();

      if (
        tooth !== action.payload.tooth ||
        currentSide !== action.payload.side.toLowerCase() ||
        currentPosition !== action.payload.position.toLowerCase()
      ) {
        return prevCommand;
      }

      let positionArray;
      if (
        ((q === 1 || q === 3) && currentSide === "buccal") ||
        ((q === 2 || q === 4) && currentSide === "lingual")
      ) {
        positionArray = ["distal", "middle", "mesial"];
      } else if (
        ((q === 1 || q === 3) && currentSide === "lingual") ||
        ((q === 2 || q === 4) && currentSide === "buccal")
      ) {
        positionArray = ["mesial", "middle", "distal"];
      }

      let currentPositionIndex = positionArray.findIndex(
        (p) => p === currentPosition
      );

      // console.log("currentPositionIndex", currentPositionIndex);

      // stay at the same zee, just move the position
      if (currentPositionIndex < 2) {
        let newPosition = positionArray[currentPositionIndex + 1];
        return {
          command: "PDRE",
          tooth: tooth,
          side: currentSide,
          position: newPosition,
          quadrant: q,
        };
      } else {
        return prevCommand;
      }
    case "CHANGE_QUADRANT":
      let quadrantToChange = action.payload.quadrant;
      if (quadrantToChange !== prevCommand.quadrant) {
        return { ...prevCommand, quadrant: quadrantToChange };
      } else {
        return prevCommand;
      }

    default:
      return prevCommand;
  }
};

const RecordPage = () => {
  const navigate = useNavigate();
  const state = useLocation();
  const userData = state.state.userData;
  const patienceID = state.state.patienceID;
  const dentistID = state.state.dentistID;

  // =========== FOR TESTING ======================
  // const userData = { email: "test@hotmail.com" };
  // const patienceID = "123456";
  // const dentistID = "654321";
  // ===============================================

  const current = new Date();
  const date = `${current.getDate()}/${
    current.getMonth() + 1
  }/${current.getFullYear()}`;

  // [States] ===============================================================
  /* states for socket.io connection */
  const [socket, setSocket] = useState(null);
  const [socketFailedToConnect, setSocketFailedToConnect] = useState(false);

  /* states for WebRTC Connection (streaming audio to backend) */
  const [peerConnection, setPeerConnection] = useState(null);
  const [localStream, setLocalStream] = useState(null);

  /* states for enable/disable streaming audio */
  const [isAudioStreaming, setIsAudioStreaming] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const pauseResumeHandler = () => {
    setIsPaused((prevIsPaused) => {
      return !prevIsPaused;
    });
  };

  /* states for teeth information */
  const [information, setInformation] = useState(EX_DATA);
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

  const checkFinishHandler = () => {
    /* if click "Finish" button, if the recording is not paused, pause the recording */
    if (!isPaused) {
      pauseResumeHandler();
    }
    setCheckFinish((prevcheckFinish) => {
      return !prevcheckFinish;
    });
  };

  const confirmHandler = () => {
    setIsFinish(true);
    checkFinishHandler();
    terminateConnection(
      socket,
      peerConnection,
      localStream,
      setSocket,
      setPeerConnection,
      setLocalStream
    );

    navigate("/summary", {
      state: {
        information: information,
        userData: userData,
        patienceID: patienceID,
        dentistID: dentistID,
        date: date,
      },
    });
  };

  const handleSetInformation = (q, i, side, mode, target, spec_id = NaN) => {
    const newInformation = information.map((obj) => {
      return teethInformationHandler(obj, q, i, side, mode, target, spec_id);
    });
    setInformation(newInformation);
  };

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

  useEffect(() => {
    initiateConnection(
      setSocket,
      setPeerConnection,
      setLocalStream,
      setSocketFailedToConnect,
      handleSetInformation,
      dispatchCurrentCommand
    );
  }, []);

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

  /* components to be rendered */
  const PDRETableComponentToBeRendered = (
    <Fragment>
      {checkFinish && (
        <Modal
          header="Confirm Information"
          content={modalConfirmContent}
          onOKClick={confirmHandler}
          onCancelClick={checkFinishHandler}
          okButtonText="Save"
          modalType="confirm"
        />
      )}
      <div className="landing-page">
        <div className={classes["top_bar"]}>
          <TopInformationBar
            date={date}
            patienceID={patienceID}
            dentistID={dentistID}
            isSummary={false}
          />
        </div>
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
        />
      </div>
    </Fragment>
  );

  const ReconnectingScreenToBeRendered = (
    <div className="landing-page">
      <div className="centered">
        <div className={classes["center-box"]}>
          <Spinner animation="border" variant="danger" />
          <p className={classes["waiting_text"]}>
            Connecting to the server <br /> Please Wait
          </p>
        </div>
      </div>
    </div>
  );

  const FailedToConnectScreenToBeRendered = (
    <div className="landing-page">
      <div className="centered">
        <div className={classes["center-box"]}>
          <FiCloudOff size="45px" />
          <p className={classes["waiting_text"]}>
            <span style={{ color: "red" }}>
              Failed to connect to the server
            </span>
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
              onClick={() => {
                setSocketFailedToConnect(false);
                initiateConnection(
                  setSocket,
                  setPeerConnection,
                  setLocalStream,
                  setSocketFailedToConnect
                );
              }}
            >
              Reconnect
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  /* connection successful - show PDRE table */
  if (true || isConnectionReady || isFinish) {
    return PDRETableComponentToBeRendered;

    /* trying to connect screen (when first load) */
  } else if (!isConnectionReady && !socketFailedToConnect && !isFinish) {
    return ReconnectingScreenToBeRendered;

    /* failed to connect screen (when first load) */
  } else if (socketFailedToConnect && !isFinish) {
    return FailedToConnectScreenToBeRendered;
  }
};

export default RecordPage;
