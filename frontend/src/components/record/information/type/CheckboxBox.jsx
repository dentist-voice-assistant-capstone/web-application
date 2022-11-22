import { useState } from "react";
// import Dropdown from "react-bootstrap/Dropdown";
// import DropdownButton from "react-bootstrap/DropdownButton";
import classes from "./CheckboxBox.module.css";
import Checkbox from "./Checkbox";

function CheckboxBox(props) {
  return (
    <div className={classes.direction}>
      <Checkbox />
      <Checkbox />
      <Checkbox />
    </div>
  );
}
export default CheckboxBox;
