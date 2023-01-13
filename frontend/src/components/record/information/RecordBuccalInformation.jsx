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
  isFinish,
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
        isFinish={isFinish}
      />
      <DropdownSmBox
        quadrant={quadrant}
        side={side}
        id={id}
        mode={"RE"}
        data={re}
        handleSetInformation={handleSetInformation}
        isFinish={isFinish}
      />
      <CheckboxBox
        quadrant={quadrant}
        side={side}
        id={id}
        mode={"BOP"}
        data={bop}
        handleSetInformation={handleSetInformation}
        isFinish={isFinish}
      />
      <DropdownLg
        quadrant={quadrant}
        side={side}
        id={id}
        mode={"MGJ"}
        data={mgj}
        handleSetInformation={handleSetInformation}
        isFinish={isFinish}
      />
    </div>
  );
};

export default RecordBuccalInformation;
