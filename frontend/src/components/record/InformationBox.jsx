import classes from "./InformationBox.module.css";

const CurrentCommandBox = ({ dentistID, patienceID, date }) => {
  return (
    <div className={classes["information-box__mainbox"]}>
      <div className={classes["information-box__subbox"]}>
        <p>Dentist ID: {dentistID}</p>
      </div>
      <div className={classes["information-box__subbox"]}>
        <p>Patience ID: {patienceID}</p>
      </div>
      <div className={classes["information-box__subbox"]}>
        <p>Date: {date}</p>
      </div>
    </div>
  );
};

export default CurrentCommandBox;
