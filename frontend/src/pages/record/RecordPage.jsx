import TopInformationBar from "../../components/record/TopInformationBar";
import { useState, useContext, useEffect } from "react";
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

import {
  initiateConnection,
  startAudioStreaming,
  stopAudioStreaming,
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
  console.log(EX_DATA);
  // const handleSetInformation = (q, i, side, mode, target, spec_id = NaN) => {
  //   const newInformation = information.map((obj) => {
  //     if (obj.quadrant === q && obj.side === side) {
  //       obj.idxArray.map((data) => {
  //         const newData = data;
  //         if (data.ID === i) {
  //           if (mode === "PD") {
  //             newData.PD[spec_id] = target;
  //             return newData;
  //           } else if (mode === "RE") {
  //             newData.RE[spec_id] = target;
  //             return newData;
  //           } else if (mode === "BOP") {
  //             newData.BOP[spec_id] = target;
  //             return newData;
  //           } else if (mode === "MO") {
  //             newData.MO = target;
  //           } else if (mode === "MGJ") {
  //             newData.MGJ = target;
  //           }
  //         }
  //         return data;
  //       });
  //     }
  //     return obj;
  //   });

  //   setInformation(newInformation);
  // };
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
      setSocketFailedToConnect
    );
  }, []);

  /* states for quadrant */
  const [quadrant, setQuadrant] = useState(1);
  const handleSelect = (e) => {
    setQuadrant(parseInt(e));
  };

  /* connection successful - show PDRE table */
  if (isConnectionReady) {
    return (
      <div className="landing-page">
        <TopInformationBar />
        <div className={classes.a}>
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
          {quadrant === 1 && <RecordInformation quadrant={information[0]} />}
          {quadrant === 2 && <RecordInformation quadrant={information[2]} />}
          {quadrant === 3 && <RecordInformation quadrant={information[4]} />}
          {quadrant === 4 && <RecordInformation quadrant={information[6]} />}
        </div>
        <RecordControlBar
          isPaused={isPaused}
          pauseResumeHandler={pauseResumeHandler}
        />
      </div>
    );

    /* trying to connect screen (when first load) */
  } else if (!isConnectionReady && !socketFailedToConnect) {
    return (
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
    /* failed to connect screen (when first load) */
  } else if (socketFailedToConnect) {
    return (
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
  }
};

export default RecordPage;
