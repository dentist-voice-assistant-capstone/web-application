import RecordBuccalInformation from "./RecordBuccalInformation";
import RecordLingualInformation from "./RecordLingualInformation";
import { useState } from "react";

import classes from "./RecordSection.module.css";

const RecordSection = ({
  quadrant,
  information,
  handleSetInformation,
  isFinish,
}) => {
  const [buccalInformation, setBuccalInformation] = useState(
    information.depended_side_data[0]
  );
  const [lingualInformation, setLingualInformation] = useState(
    information.depended_side_data[1]
  );
  const mo = information.MO;
  const mgj = information.MGJ;
  const id = information.ID;

  return (
    <div>
      {!information.missing && (
        <div className={classes.direction}>
          <RecordBuccalInformation
            quadrant={quadrant}
            id={id}
            buccalInformation={buccalInformation}
            mgj={mgj}
            handleSetInformation={handleSetInformation}
          />
          <div className={classes.title}>{`${quadrant}${information.ID}`}</div>
          <RecordLingualInformation
            quadrant={quadrant}
            id={id}
            lingualInformation={lingualInformation}
            mo={mo}
            handleSetInformation={handleSetInformation}
          />
        </div>
      )}
      {information.missing && (
        <div className={classes.direction}>
          <div className={classes.missingBox}>
            <div
              className={classes.title}
            >{`${quadrant}${information.ID}`}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordSection;
