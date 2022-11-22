import classes from "./RecordHeader.module.css";

const RecordHeader = () => {
  return (
    <div className={classes.side_direction}>
      <div className={classes.side_space}>
        <div className={classes.side}>BUCCAL</div>
        <div className={classes.side}>LINGUAL</div>
      </div>
      <div className={classes.direction}>
        <div className={classes.title}>PD</div>
        <div className={classes.title}>RE</div>
        <div className={classes.title}>BOP</div>
        <div className={classes.title}>MGJ</div>
        <div className={classes.title}> </div>
        <div className={classes.title}>MO</div>
        <div className={classes.title}>BOP</div>
        <div className={classes.title}>PD</div>
        <div className={classes.title}>RE</div>
      </div>
    </div>
  );
};

export default RecordHeader;
