import { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import classes from "./RecordControlBar.module.css";

function RecordControlBar(props) {
  // states for handling initial fetching user's data
  const [isPaused, setIsPaused] = useState(false);

  function pauseResumeHandler() {
    setIsPaused(!isPaused);
  }

  return (
    <Navbar bg="black" variant="dark" fixed="bottom">
      <div className={classes.recordControlContainer}>
        <Navbar.Brand className={classes.actions}>
          <button className={classes.recordButton} onClick={pauseResumeHandler}>
            {isPaused ? "Resume" : "Pause"}
          </button>
          {!isPaused && (
            <div className={classes.blinking}>
              <text>test</text>
            </div>
          )}

          <button className={classes.finishButton}>Finish</button>
        </Navbar.Brand>
      </div>
    </Navbar>
  );
}

export default RecordControlBar;
