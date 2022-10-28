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
      <Container className={classes.container}>
        <Navbar.Brand className={classes.actions}>
          <button className={classes.recordButton} onClick={pauseResumeHandler}>
            {isPaused ? "Resume" : "Pause"}
          </button>
          <button className={classes.finishButton}>Finish</button>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default RecordControlBar;
