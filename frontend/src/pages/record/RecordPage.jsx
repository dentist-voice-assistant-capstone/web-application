/* import React Libraries */
import { useState, useEffect, useReducer, Fragment } from "react";
import { useNavigate } from "react-router-dom";

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
import {
  initiateConnection,
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
};

const currentCommandReducer = (prevCommand, action) => {
  switch (action.type) {
    case "CLEAR_COMMAND":
      return defaultCurrentCommand;
    case "UPDATE_COMMAND":
      // -- if the same command, use the old command ??? --
      // if (
      //   action.payload.command === prevCommand.command &&
      //   action.payload.tooth === prevCommand.tooth &&
      //   action.payload.side === prevCommand.side
      // ) {
      //   return prevCommand;
      // }
      return action.payload;
    case "NEXT_TOOTH":
      if (!!action.payload.next_tooth) {
        let position = null;
        if (action.payload.mode === "RE") {
          position = getToothStartPosition(
            action.payload.next_tooth.q,
            action.payload.next_tooth.i,
            prevCommand.side
          );
        }
        return {
          command: prevCommand.command,
          tooth:
            action.payload.next_tooth.q.toString() +
            action.payload.next_tooth.i.toString(),
          side: prevCommand.side,
          position: position,
        };
      } else {
        return prevCommand;
      }
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
        ((q === 1 || q === 4) && currentSide === "buccal") ||
        ((q === 2 || q === 3) && currentSide === "lingual")
      ) {
        positionArray = ["distal", "middle", "mesial"];
      } else if (
        ((q === 1 || q === 4) && currentSide === "lingual") ||
        ((q === 2 || q === 3) && currentSide === "buccal")
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
        };
      } else {
        return prevCommand;
      }
    default:
      return prevCommand;
  }
};

const RecordPage = () => {
  const navigate = useNavigate();

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

  // const [currentCommand, setCurrentCommand] = useState({
  //   command: "MO",
  //   tooth: "17",
  //   side: null,
  //   position: "middle", //should be "distal", "middle" or "mesial" !!
  // });

  /* states for quadrant */
  const [quadrant, setQuadrant] = useState(1);
  const handleSelect = (e) => {
    setQuadrant(parseInt(e));
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

  const summaryHandler = () => {
    // console.log(information);
    navigate("/summary", {
      state: { information: information },
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
  };

  const handleAutoChangeQuadrant = (quadrantToChange) => {
    setQuadrant((prevQuadrant) => {
      if (prevQuadrant !== quadrantToChange) {
        console.log(`Current Q${quadrant}, Change To Q${quadrantToChange}`);
        return quadrantToChange;
      }
      return prevQuadrant;
    });
  };

  const handleSetInformation = (q, i, side, mode, target, spec_id = NaN) => {
    const newInformation = information.map((obj) => {
      if (obj.quadrant === q) {
        obj.idxArray.map((data) => {
          if (data.ID === i) {
            if (mode === "PD") {
              const newPD = data.depended_side_data.map((checkSide) => {
                if (checkSide.side === side) {
                  checkSide.PD[spec_id] = target;
                }
                return checkSide;
              });

              return newPD;
            } else if (mode === "RE") {
              const newRE = data.depended_side_data.map((checkSide) => {
                if (checkSide.side === side) {
                  checkSide.RE[spec_id] = target;
                }
                return checkSide;
              });

              return newRE;
            } else if (mode === "BOP") {
              const newBOP = data.depended_side_data.map((checkSide) => {
                if (checkSide.side === side) {
                  checkSide.BOP[spec_id] = target;
                }
                return checkSide;
              });

              return newBOP;
            } else if (mode === "MO") {
              data.MO = target;
              return data;
            } else if (mode === "MGJ") {
              data.MGJ = target;
              return data;
            } else if (mode === "Missing") {
              data.missing = target;
              return data;
            }
          }
          return data;
        });
      }
      return obj;
    });
    // console.log(newInformation);

    setInformation(newInformation);
    handleAutoChangeQuadrant(q);
  };
  // console.log("===============");
  // console.log(information);
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
        <TopInformationBar />
        <div className={classes.current_command_box}>
          <CurrentCommandBox
            command={currentCommand.command}
            tooth={currentCommand.tooth}
          />
        </div>
        <div className={classes.droplist}>
          <DropdownButton
            className={classes.box}
            title={quadrant}
            onSelect={handleSelect}
          >
            <Dropdown.Item eventKey="1">1</Dropdown.Item>
            <Dropdown.Item eventKey="2">2</Dropdown.Item>
            <Dropdown.Item eventKey="3">3</Dropdown.Item>
            <Dropdown.Item eventKey="4">4</Dropdown.Item>
          </DropdownButton>
        </div>
        <div className="centered">
          {quadrant === 1 && (
            <RecordInformation
              information={information[0]}
              currentCommand={currentCommand}
              handleSetInformation={handleSetInformation}
            />
          )}
          {quadrant === 2 && (
            <RecordInformation
              information={information[1]}
              currentCommand={currentCommand}
              handleSetInformation={handleSetInformation}
            />
          )}
          {quadrant === 3 && (
            <RecordInformation
              information={information[2]}
              currentCommand={currentCommand}
              handleSetInformation={handleSetInformation}
            />
          )}
          {quadrant === 4 && (
            <RecordInformation
              information={information[3]}
              currentCommand={currentCommand}
              handleSetInformation={handleSetInformation}
            />
          )}
        </div>
        <button
          style={{ margin: "50px 20px 0px 50px" }}
          onClick={() => {
            // dispatchCurrentCommand({
            //   type: "UPDATE_COMMAND",
            //   payload: {
            //     command: "PDRE",
            //     tooth: "15",
            //     side: "lingual",
            //     position: "mesial",
            //   },
            // });
          }}
        >
          Initialize
        </button>
        <button
          style={{ margin: "50px 20px 0px 50px" }}
          onClick={() => {
            // dispatchCurrentCommand({
            //   type: "UPDATE_PDRE_POSITION",
            //   payload: {
            //     tooth: "15",
            //     side: "lingual",
            //     position: "middle",
            //   },
            // });
          }}
        >
          Move
        </button>
        <RecordControlBar
          isPaused={isPaused}
          isFinish={!isFinish}
          pauseResumeHandler={pauseResumeHandler}
          checkFinishHandler={checkFinishHandler}
          summaryHandler={summaryHandler}
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
