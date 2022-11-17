import RecordBuccalInformation from "./RecordBuccalInformation";
import RecordLingualInformation from "./RecordLingualInformation";
import classes from "./RecordSection.module.css";

const RecordSection = ({ id }) => {
  return (
    <div className={classes.direction}>
      <RecordBuccalInformation />
      <div className={classes.title}>{id}</div>
      <RecordLingualInformation />
    </div>
  );
};

export default RecordSection;
