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
  isHighlighted,
}) {
  const spec_id =
    quadrant === 1 || quadrant === 4
      ? ["distal", "middle", "mesial"]
      : ["mesial", "middle", "distal"];

  return (
    <div
      className={`${classes["direction"]} ${
        isHighlighted ? classes["highlighted"] : ""
      }`}
    >
      <Checkbox
        quadrant={quadrant}
        side={side}
        id={id}
        mode={mode}
        specific_id={spec_id[0]}
        data={data[spec_id[0]]}
        handleSetInformation={handleSetInformation}
      />
      <Checkbox
        quadrant={quadrant}
        side={side}
        id={id}
        mode={mode}
        specific_id={spec_id[1]}
        data={data[spec_id[1]]}
        handleSetInformation={handleSetInformation}
      />
      <Checkbox
        quadrant={quadrant}
        side={side}
        id={id}
        mode={mode}
        specific_id={spec_id[2]}
        data={data[spec_id[2]]}
        handleSetInformation={handleSetInformation}
      />
    </div>
  );
}
export default CheckboxBox;
