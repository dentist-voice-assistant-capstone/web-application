import DropdownLg from "../information/type/DropdownLg";
import DropdownSmBox from "../information/type/DropdownSmBox";
import CheckboxBox from "../information/type/CheckboxBox";

import classes from "./RecordBuccalInformation.module.css";

const RecordBuccalInformation = ({
  quadrant,
  id,
  buccalInformation,
  mgj,
  handleSetInformation,
}) => {
  const pd = buccalInformation.PD;
  const re = buccalInformation.RE;
  const bop = buccalInformation.BOP;
  const side = buccalInformation.side;

  return (
    <div className={classes.direction}>
      <DropdownSmBox
        quadrant={quadrant}
        side={side}
        id={id}
        mode={"PD"}
        data={pd}
        handleSetInformation={handleSetInformation}
      />
      <DropdownSmBox
        quadrant={quadrant}
        side={side}
        id={id}
        mode={"RE"}
        data={re}
        handleSetInformation={handleSetInformation}
      />
      <CheckboxBox
        quadrant={quadrant}
        side={side}
        id={id}
        mode={"BOP"}
        data={bop}
        handleSetInformation={handleSetInformation}
      />
      <DropdownLg
        quadrant={quadrant}
        side={side}
        id={id}
        mode={"MGJ"}
        data={mgj}
        handleSetInformation={handleSetInformation}
      />
    </div>
  );
};

export default RecordBuccalInformation;
