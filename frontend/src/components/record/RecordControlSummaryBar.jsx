import { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import classes from "./RecordControlBar.module.css";

function RecordControlBar(props) {
  return (
    <div className={classes["control-bar"]}>
      <Navbar bg="black" variant="dark" fixed="bottom">
        <Navbar.Brand className={classes.actions}>
          <button
            className={classes.exportButton}
            onClick={props.checkMailExportHandler}
          >
            Send to email
          </button>
          <button
            className={classes.saveAsButton}
            onClick={() => props.createReport(props.data, props.file_name)}
          >
            Save as
          </button>
        </Navbar.Brand>
      </Navbar>
    </div>
  );
}

export default RecordControlBar;
