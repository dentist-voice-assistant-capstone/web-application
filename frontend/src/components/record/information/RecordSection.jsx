import RecordBuccalInformation from "./RecordBuccalInformation";
import RecordLingualInformation from "./RecordLingualInformation";
import classes from "./RecordSection.module.css";

const RecordSection = (props) => {
  return (
    <div className={classes.direction}>
      <RecordBuccalInformation />
      <div>21</div>
      <RecordLingualInformation />
    </div>
  );
};

export default RecordSection;
