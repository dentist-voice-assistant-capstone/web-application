import RecordBuccalInformation from "./RecordBuccalInformation";
import RecordLingualInformation from "./RecordLingualInformation";

import classes from "./RecordSection.module.css";

const RecordSection = ({
  quadrant,
  information,
  handleSetInformation,
  handleUndoToothMissing,
  handleAddToothMissing,
  tooth,
  currentCommand,
}) => {
  const buccalInformation = information.depended_side_data[0];
  const lingualInformation = information.depended_side_data[1];

  const mo = information.MO;
  const mgj = information.MGJ;
  const id = information.ID;

  // console.log(tooth, currentCommand);

  let highlightCommandBuccalSide = false;
  let highlightCommandLingualSide = false;
  const command =
    !!currentCommand && !!currentCommand.command
      ? currentCommand.command
      : null;
  if (command === "PDRE" || command == "BOP") {
    const side = !!currentCommand.side
      ? currentCommand.side.toLowerCase()
      : null;
    if (side === "buccal") {
      highlightCommandBuccalSide = true;
    } else if (side === "lingual") {
      highlightCommandLingualSide = true;
    }
  } else if (command === "MGJ") {
    highlightCommandBuccalSide = true;
  } else if (command === "MO") {
    highlightCommandLingualSide = true;
  }

  const handleClickMissingBox = () => {
    handleUndoToothMissing(quadrant, information.ID);
  };

  const handleClickToothIDDiv = () => {
    handleAddToothMissing(quadrant, information.ID);
  }

  return (
    <div>
      {/* not missing */}
      {!information.missing && (
        <div className={classes.direction}>
          <RecordBuccalInformation
            quadrant={quadrant}
            id={id}
            buccalInformation={buccalInformation}
            mgj={mgj}
            handleSetInformation={handleSetInformation}
            currentCommand={highlightCommandBuccalSide ? currentCommand : null}
          />
          <div
            className={`${classes.title} ${!!currentCommand ? classes.hightlighted : null
              }`}
            onClick={handleClickToothIDDiv}
          >{`${quadrant}${information.ID}`}</div>
          <RecordLingualInformation
            quadrant={quadrant}
            id={id}
            lingualInformation={lingualInformation}
            mo={mo}
            handleSetInformation={handleSetInformation}
            currentCommand={highlightCommandLingualSide ? currentCommand : null}
          />
        </div>
      )}
      {/* missing */}
      {information.missing && (
        <div className={classes.direction}>
          <div className={classes.missingBox} onClick={handleClickMissingBox}>
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
