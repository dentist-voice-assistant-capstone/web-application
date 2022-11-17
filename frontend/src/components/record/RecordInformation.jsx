import { useState } from "react";
import classes from "./RecordInformation.module.css";
import RecordSection from "./information/RecordSection";

const RecordInformation = () => {
  const data = [1, 2, 3, 4, 5, 6, 7, 8];
  const [quadrant, setQuadrant] = useState("1");

  return (
    <div className={classes.direction}>
      {data.map((id) => (
        <RecordSection id={`${quadrant}${id}`} />
      ))}
    </div>
  );
};

export default RecordInformation;
