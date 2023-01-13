import { useState } from "react";
// import Dropdown from "react-bootstrap/Dropdown";
// import DropdownButton from "react-bootstrap/DropdownButton";
import classes from "./CheckboxBox.module.css";
import Checkbox from "./Checkbox";

function CheckboxBox({
  quadrant,
  side,
  id,
  mode,
  data,
  handleSetInformation,
  isFinish,
}) {
  return (
    <div className={classes.direction}>
      <Checkbox
        quadrant={quadrant}
        side={side}
        id={id}
        mode={mode}
        specific_id={0}
        data={data[0]}
        handleSetInformation={handleSetInformation}
        isFinish={isFinish}
      />
      <Checkbox
        quadrant={quadrant}
        side={side}
        id={id}
        mode={mode}
        specific_id={1}
        data={data[1]}
        handleSetInformation={handleSetInformation}
        isFinish={isFinish}
      />
      <Checkbox
        quadrant={quadrant}
        side={side}
        id={id}
        mode={mode}
        specific_id={2}
        data={data[2]}
        handleSetInformation={handleSetInformation}
        isFinish={isFinish}
      />
    </div>
  );
}
export default CheckboxBox;
