import { useState } from "react";
// import Dropdown from "react-bootstrap/Dropdown";
// import DropdownButton from "react-bootstrap/DropdownButton";
import classes from "./DropdownSmBox.module.css";
import DropdownSm from "./DropdownSm";

function RecordDropdownBox(props) {
  return (
    <div className={classes.direction}>
      <DropdownSm />
      <DropdownSm />
      <DropdownSm />
    </div>
  );
}
export default RecordDropdownBox;
