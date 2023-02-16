import { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import classes from "./RecordControlBar.module.css";

function RecordControlBar(props) {
  return (
    <Navbar bg="black" variant="dark" fixed="bottom" style={{ zIndex: 0 }}>
      <div className={classes.recordControlContainer}>
        <Navbar.Brand className={classes.actions}>
          <button
            className={classes.finishButton}
            onClick={props.createReport(props.data)}
          >
            Send to email
          </button>
          <button
            className={classes.finishButton}
            onClick={props.sendReportExcelAPIHandler(props.data, props.email)}
          >
            Save as
          </button>
        </Navbar.Brand>
      </div>
    </Navbar>
  );
}

export default RecordControlBar;
