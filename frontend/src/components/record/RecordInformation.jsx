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
          key={information.quadrant.toString() + idx.ID.toString()}
          tooth={information.quadrant.toString() + idx.ID.toString()}
          quadrant={information.quadrant}
          information={idx}
          handleSetInformation={handleSetInformation}
          currentCommand={
            information.quadrant.toString() + idx.ID.toString() ===
            currentCommand.tooth
              ? currentCommand
              : null
          }
        />
      ))}
    </div>
  );
};

export default RecordInformation;
