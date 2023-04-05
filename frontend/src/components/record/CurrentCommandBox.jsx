import classes from "./CurrentCommandBox.module.css";

const CurrentCommandBox = ({ command, tooth }) => {
  return (
    <div className={classes["current-command-box__mainbox"]}>
      <div className={classes["current-command-box__subbox"]}>
        <p>Command:</p>
        <p>{!!command ? command : "-"}</p>
      </div>
      <div className={classes["current-command-box__subbox"]}>
        <p>Tooth:</p>
        <p>{!!tooth ? tooth : "-"}</p>
      </div>
    </div>
  );
};

export default CurrentCommandBox;
