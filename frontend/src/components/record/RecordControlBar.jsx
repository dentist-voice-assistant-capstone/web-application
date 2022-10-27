import { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import classes from "./RecordControlBar.module.css";

function RecordControlBar(props) {
  console.log(props);

  // states for handling initial fetching user's data
  const [isPaused, setIsPaused] = useState(false);

  function pauseResumeHandler() {
    setIsPaused(!isPaused);
  }

  return (
    <Navbar bg="black" variant="dark" fixed="bottom">
      <Container>
        <Navbar.Brand className={classes.actions}>
          <div> </div>
          <button className="recordButton" onClick={pauseResumeHandler}>
            {isPaused ? "Resume" : "Pause"}
          </button>
          <button className="finishButton">Finish</button>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default RecordControlBar;
