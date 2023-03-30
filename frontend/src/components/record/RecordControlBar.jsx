import { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import classes from "./RecordControlBar.module.css";

function RecordControlBar(props) {
  return (
    <Navbar bg="black" variant="dark" fixed="bottom" style={{ zIndex: 0 }}>
      {props.isFinish && (
        <div className={classes.recordControlContainer}>
          <Navbar.Brand className={classes.actions}>
            <div className={`${classes.connectionStatusBox} ${classes[props.currentConnectionStatus.toLowerCase()]}`}>
              <p>{props.currentConnectionStatus}</p>
            </div>

            <div className={classes.pauseResumeContainer} style={{ visibility: `${props.currentConnectionStatus.toLowerCase() !== "connected" ? 'hidden' : 'visible'}` }}>
              <button
                className={classes.recordButton}
                onClick={props.pauseResumeHandler}
              >
                {props.isPaused ? "Resume" : "Pause"}
              </button>
              <div className={classes.blinking} style={{ visibility: `${props.isPaused || props.currentConnectionStatus.toLowerCase() !== "connected" ? 'hidden' : 'visible'}` }}></div>
            </div>

            <div className={classes.finishContainer}>
              <button
                className={classes.finishButton}
                onClick={props.checkFinishHandler}
              >
                Finish
              </button>
            </div>
          </Navbar.Brand>
        </div>
      )}
    </Navbar>
  );
}

export default RecordControlBar;
