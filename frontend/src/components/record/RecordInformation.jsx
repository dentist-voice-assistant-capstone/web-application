import { useState } from "react";
import classes from "./RecordInformation.module.css";
import RecordSection from "./information/RecordSection";
import RecordHeader from "./information/RecordHeader";

const RecordInformation = ({
  information,
  handleSetInformation,
  currentCommand,
  isFinish,
}) => {
  return (
    <div className={classes.direction}>
      <RecordHeader currentCommand={currentCommand} />
      {information.idxArray.map((idx) => (
        <RecordSection
          quadrant={information.quadrant}
          information={idx}
          handleSetInformation={handleSetInformation}
        />
      ))}
    </div>
  );
};

export default RecordInformation;
