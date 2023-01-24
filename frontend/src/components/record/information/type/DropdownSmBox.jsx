import { useState } from "react";
// import Dropdown from "react-bootstrap/Dropdown";
// import DropdownButton from "react-bootstrap/DropdownButton";
import classes from "./DropdownSmBox.module.css";
import DropdownSm from "./DropdownSm";

function RecordDropdownBox({
  quadrant,
  side,
  id,
  mode,
  data,
  handleSetInformation,
}) {
  const spec_id =
    quadrant === 1 || quadrant === 4
      ? ["distal", "middle", "mesial"]
      : ["mesial", "middle", "distal"];
  return (
    <div className={classes.direction}>
      <DropdownSm
        quadrant={quadrant}
        side={side}
        id={id}
        mode={mode}
        specific_id={spec_id[0]}
        data={data[spec_id[0]]}
        handleSetInformation={handleSetInformation}
      />
      <DropdownSm
        quadrant={quadrant}
        id={id}
        side={side}
        mode={mode}
        specific_id={spec_id[1]}
        data={data[spec_id[1]]}
        handleSetInformation={handleSetInformation}
      />
      <DropdownSm
        quadrant={quadrant}
        id={id}
        side={side}
        mode={mode}
        specific_id={spec_id[2]}
        data={data[spec_id[2]]}
        handleSetInformation={handleSetInformation}
      />
    </div>
  );
}
export default RecordDropdownBox;
