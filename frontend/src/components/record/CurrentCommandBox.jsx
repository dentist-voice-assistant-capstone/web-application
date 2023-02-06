import classes from "./CurrentCommandBox.module.css";

const CurrentCommandBox = () => {
  return (
    <div className={classes["current-command-box__mainbox"]}>
      <div className={classes["current-command-box__subbox"]}>
        <p>Command:</p>
        <p>Missing</p>
      </div>
      <div className={classes["current-command-box__subbox"]}>
        <p>Tooth:</p>
        <p>18</p>
      </div>
    </div>
  );
};

export default CurrentCommandBox;
