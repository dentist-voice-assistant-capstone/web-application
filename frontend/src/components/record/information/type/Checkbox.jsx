import { useState } from "react";
import classes from "./Checkbox.module.css";

function Checkbox({
  quadrant,
  side,
  id,
  mode,
  specific_id,
  data,
  handleSetInformation,
}) {
  const handleSelect = (target) => {
    handleSetInformation(quadrant, id, side, mode, target, specific_id);
  };

  return (
    <label className={classes.l}>
      <input
        type="checkbox"
        onChange={() => {
          handleSelect(!data);
        }}
      />
      <span
        className={`checkbox ${data ? "checkbox--active" : ""}`}
        // This element is purely decorative so
        // we hide it for screen readers
        aria-hidden="true"
      />
    </label>
  );
}

export default Checkbox;
