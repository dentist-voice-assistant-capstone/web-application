import { useState } from "react";
import classes from "./Checkbox.module.css";

function Checkbox() {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <label className={classes.l}>
      <input
        type="checkbox"
        onChange={() => {
          setIsChecked(!isChecked);
        }}
      />
      <span
        className={`checkbox ${isChecked ? "checkbox--active" : ""}`}
        // This element is purely decorative so
        // we hide it for screen readers
        aria-hidden="true"
      />
    </label>
  );
}

export default Checkbox;
