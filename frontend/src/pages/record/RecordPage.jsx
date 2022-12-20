import TopInformationBar from "../../components/record/TopInformationBar";
import { useState, useContext, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import classes from "./RecordPage.module.css";
// import NavBar from "../../components/ui/NavBar";
import { useNavigate, useLocation } from "react-router-dom";
// import { startAPIHandler } from "../../utils/apiHandler";
import RecordControlBar from "../../components/record/RecordControlBar";

import RecordInformation from "../../components/record/RecordInformation";

import SocketWebRTCContext from "../../store/socket-webRTC-context";

const RecordPage = () => {
  /* React Context for handling socket and WebRTC Connection with backend streaming server */
  const socketWebRTCCtx = useContext(SocketWebRTCContext);

  const [quadrant, setQuadrant] = useState("1");
  const handleSelect = (e) => {
    setQuadrant(e);
  };

  useEffect(() => {
    /* This function is used to initiate socket.io connection
     * and the Client's RTCPeerConnection in order to stream audio to the backend server.
     */
    socketWebRTCCtx.initiateConnection();
  }, []);

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
        {quadrant == 1 && <RecordInformation quadrant={1} />}
        {quadrant == 2 && <RecordInformation quadrant={2} />}
        {quadrant == 3 && <RecordInformation quadrant={3} />}
        {quadrant == 4 && <RecordInformation quadrant={4} />}
        {/* {Boolean(quadrant.localeCompare("1")) && (
          <RecordInformation quadrant={1} />
        )}
        {Boolean(quadrant.localeCompare("2")) && (
          <RecordInformation quadrant={2} />
        )}
        {Boolean(quadrant.localeCompare("3")) && (
          <RecordInformation quadrant={3} />
        )}
        {Boolean(quadrant.localeCompare("4")) && (
          <RecordInformation quadrant={4} />
        )} */}
      </div>
      <RecordControlBar />
    </div>
  );
};

export default RecordPage;
