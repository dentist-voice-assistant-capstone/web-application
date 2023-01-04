import { useState } from "react";
import classes from "./RecordInformation.module.css";
import RecordSection from "./information/RecordSection";
import RecordHeader from "./information/RecordHeader";

const RecordInformation = ({ quadrant }) => {
  // const idx = [1, 2, 3, 4, 5, 6, 7, 8];
  //   const [quadrant, setQuadrant] = useState("1");

  return (
    <div className={classes.direction}>
      <RecordHeader />
      {quadrant.idxArray.map((idx) => (
        <RecordSection id={`${quadrant.quadrant}${idx.id}`} />
      ))}
    </div>
  );
};

export default RecordInformation;
