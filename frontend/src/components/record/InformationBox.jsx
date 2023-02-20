import classes from "./InformationBox.module.css";

const CurrentCommandBox = ({ dentistID, patienceID, date }) => {
  return (
    <div className={classes["information-box__mainbox"]}>
      <div className={classes["information-box__subbox"]}>
        <p>Dentist ID: </p>
        <p>{dentistID}</p>
      </div>
      <div className={classes["information-box__subbox"]}>
        <p>Patience ID: </p>
        <p>{patienceID}</p>
      </div>
      <div className={classes["information-box__subbox"]}>
        <p>Date: </p>
        <p>{date}</p>
      </div>
    </div>
  );
};

export default CurrentCommandBox;
