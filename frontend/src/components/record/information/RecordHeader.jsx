import classes from "./RecordHeader.module.css";

const RecordHeader = ({ currentCommand }) => {
  const command = currentCommand.command;
  const side = !!currentCommand.side ? currentCommand.side.toLowerCase() : null;

  const commandToHighLight = {
    PDREBuccal: false,
    PDRELingual: false,
    BOPBuccal: false,
    BOPLingual: false,
    MGJ: command === "MGJ",
    MO: command === "MO",
  };

  if (command === "PDRE") {
    commandToHighLight.PDREBuccal = true;
    commandToHighLight.PDRELingual = true;
    if (side === "buccal") {
      commandToHighLight.PDRELingual = false;
    } else if (side === "lingual") {
      commandToHighLight.PDREBuccal = false;
    }
  } else if (command === "BOP") {
    commandToHighLight.BOPBuccal = true;
    commandToHighLight.BOPLingual = true;
    if (side === "buccal") {
      commandToHighLight.BOPLingual = false;
    } else if (side === "lingual") {
      commandToHighLight.BOPBuccal = false;
    }
  }

  return (
    <div className={classes.side_direction}>
      <div className={classes.side_space}>
        <div
          className={`${classes["side"]} ${
            side === "buccal" ? classes["highlighted"] : ""
          }`}
        >
          BUCCAL
        </div>
        <div
          className={`${classes["side"]} ${
            side === "lingual" ? classes["highlighted"] : ""
          }`}
        >
          LINGUAL
        </div>
      </div>

      <div className={classes.direction}>
        {/* upper */}
        <div
          className={`${classes["title"]} ${
            commandToHighLight.PDREBuccal ? classes["highlighted"] : ""
          }`}
        >
          PD
        </div>
        <div
          className={`${classes["title"]} ${
            commandToHighLight.PDREBuccal ? classes["highlighted"] : ""
          }`}
        >
          RE
        </div>
        <div
          className={`${classes["title"]} ${
            commandToHighLight.BOPBuccal ? classes["highlighted"] : ""
          }`}
        >
          BOP
        </div>
        <div
          className={`${classes["title"]} ${
            commandToHighLight.MGJ ? classes["highlighted"] : ""
          }`}
        >
          MGJ
        </div>
        <div className={classes.title}> </div>
        {/* lower */}
        <div
          className={`${classes["title"]} ${
            commandToHighLight.MO ? classes["highlighted"] : ""
          }`}
        >
          MO
        </div>
        <div
          className={`${classes["title"]} ${
            commandToHighLight.BOPLingual ? classes["highlighted"] : ""
          }`}
        >
          BOP
        </div>
        <div
          className={`${classes["title"]} ${
            commandToHighLight.PDRELingual ? classes["highlighted"] : ""
          }`}
        >
          PD
        </div>
        <div
          className={`${classes["title"]} ${
            commandToHighLight.PDRELingual ? classes["highlighted"] : ""
          }`}
        >
          RE
        </div>
      </div>
    </div>
  );
};

export default RecordHeader;
