import TopInformationBar from "../../components/record/TopInformationBar";
import { useState, useContext, useEffect, Fragment } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import classes from "./RecordPage.module.css";
import { EX_DATA } from "../../utils/constants";
// import NavBar from "../../components/ui/NavBar";
import { useNavigate, useLocation } from "react-router-dom";
// import { startAPIHandler } from "../../utils/apiHandler";
import RecordControlBar from "../../components/record/RecordControlBar";
import RecordInformation from "../../components/record/RecordInformation";
import Spinner from "react-bootstrap/Spinner";
import { FiCloudOff } from "react-icons/fi";
import Modal from "../../components/ui/Modal";

import {
  initiateConnection,
  startAudioStreaming,
  stopAudioStreaming,
  terminateConnection,
} from "../../utils/socketWebRTCHandler";

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

  const [information, setInformation] = useState(EX_DATA);
  const [checkFinish, setCheckFinish] = useState(false);
  const [isFinish, setIsFinish] = useState(false);

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
            }
          }
          return data;
        });
      }
      return obj;
    });

    setInformation(newInformation);
  };
  console.log("===============")
  console.log(information)
  console.log("===============")
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
      handleSetInformation
    );
  }, []);

  /* states for quadrant */
  const [quadrant, setQuadrant] = useState(1);
  const handleSelect = (e) => {
    setQuadrant(parseInt(e));
  };

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
              handleSetInformation={handleSetInformation}
            />
          )}
          {quadrant === 2 && (
            <RecordInformation
              information={information[1]}
              handleSetInformation={handleSetInformation}
            />
          )}
          {quadrant === 3 && (
            <RecordInformation
              information={information[2]}
              handleSetInformation={handleSetInformation}
            />
          )}
          {quadrant === 4 && (
            <RecordInformation
              information={information[3]}
              handleSetInformation={handleSetInformation}
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
  if (isConnectionReady || isFinish) {
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
