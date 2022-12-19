import DropdownLg from "../information/type/DropdownLg";
import DropdownSmBox from "../information/type/DropdownSmBox";
import CheckboxBox from "../information/type/CheckboxBox";

import classes from "./RecordBuccalInformation.module.css";

const RecordBuccalInformation = () => {
  return (
    <div className={classes.direction}>
      <DropdownSmBox />
      <DropdownSmBox />
      <CheckboxBox />
      <DropdownLg />
    </div>
  );
};

export default RecordBuccalInformation;
