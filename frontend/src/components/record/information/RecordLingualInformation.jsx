import DropdownLg from "./type/DropdownLg";
import DropdownSmBox from "./type/DropdownSmBox";
import CheckboxBox from "./type/CheckboxBox";

import classes from "./RecordLingualInformation.module.css";

const RecordLingualInformation = ({
  quadrant,
  id,
  lingualInformation,
  mo,
  handleSetInformation,
}) => {
  const pd = lingualInformation.PD;
  const re = lingualInformation.RE;
  const bop = lingualInformation.BOP;
  const side = lingualInformation.side;

  return (
    <div className={classes.direction}>
      <DropdownLg
        quadrant={quadrant}
        side={side}
        id={id}
        mode={"MO"}
        data={mo}
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
    </div>
  );
};

export default RecordLingualInformation;
