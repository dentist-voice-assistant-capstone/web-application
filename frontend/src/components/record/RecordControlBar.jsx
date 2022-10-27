import { useState, useContext, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import classes from "./RecordControlBar.module.css";

function RecordControlBar(props) {
  console.log(props);

  // states for handling initial fetching user's data
  const [isLoaded, setIsLoaded] = useState(false);
  const [ispaused, setIsPaused] = useState(false);

  function pauseResume() {
    setIsPaused(!this.ispaused);
  }

  return (
    <Navbar bg="black" variant="dark" fixed="bottom">
      <Container>
        {isLoaded && (
          <Navbar.Brand className={classes.actions}>
            <div>
              <button onClick={pauseResume()}>
                {this.isPaused ? "Resume" : "Pause"}
              </button>
            </div>
          </Navbar.Brand>
        )}
      </Container>
    </Navbar>
  );
}

export default RecordControlBar;
