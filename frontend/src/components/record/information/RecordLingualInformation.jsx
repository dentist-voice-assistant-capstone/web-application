import DropdownLg from "./type/DropdownLg";
import DropdownSmBox from "./type/DropdownSmBox";
import CheckboxBox from "./type/CheckboxBox";

import classes from "./RecordLingualInformation.module.css";

const RecordLingualInformation = () => {
  return (
    <div className={classes.direction}>
      <DropdownLg />
      <CheckboxBox />
      <DropdownSmBox />
      <DropdownSmBox />
    </div>
  );
};

export default RecordLingualInformation;
