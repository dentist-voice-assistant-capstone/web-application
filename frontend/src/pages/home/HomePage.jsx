import classes from "./HomePage.module.css";
import NavBar from "../../components/ui/NavBar";
import { useNavigate } from "react-router-dom";
import { useState, Fragment } from "react";
import { startAPIHandler } from "../../utils/apiHandler";

const HomePage = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [patienceID, setPatienceID] = useState("123456");
  const [dentistID, setDentistID] = useState("654321");
  const [isStart, setIsStart] = useState(false);

  //   -----------------------------------------TOGGLE MODAL--------------------------------------------------
  //   const checkIsStartHandler = () => {
  //     setIsStart((prevcheckIsStart) => {
  //       return !prevcheckIsStart;
  //     });
  //   };
  // -----------------------------------------------------------------------------------------------------

  function startHandler() {
    startAPIHandler();
    navigate("/record", {
      state: {
        userData: userData,
        patienceID: patienceID,
        dentistID: dentistID,
      },
    });
  }

  function editAccountMenuOnClickHandler() {
    navigate("/account/edit");
  }

  return (
    <Fragment>
      {/* Assign to Joey, Create InputModal to fill patienceID and dentistID fields before starting record.

      Might use setPatienceID and setDentistID functions to update

      In component/ui, you should create a InputModal.jsx like a Modal.jsx file

      When start button is clicked, you should set isStart to true then the InputModal will be appeared.

      If patientID and dentistID fields in are filled in, you should update and navigate to RecordPage. You can use startHandler function to navigate na krub. */}
      {/* ----------------------------------------------ADD HERE----------------------------------------------
      {isStart && (
        <InputModal
        />
      )}
----------------------------------------------------------------------------------------------------- */}
      <div className="landing-page">
        <NavBar
          email={"email"}
          userData={userData}
          setUserData={setUserData}
        ></NavBar>
        {/* </div> */}
        <div className={classes.actions}>
          <button onClick={startHandler}>Start</button>

          {/* -----------------------------------------------------------------------------------------------------
          Uncomment To toggle isStart then use startHandler function in InputModal
          <button onClick={checkIsStartHandler}>Start</button>
----------------------------------------------------------------------------------------------------- */}
        </div>
        <div className={classes.actions}>
          <button onClick={editAccountMenuOnClickHandler}>Account Edit</button>
        </div>
      </div>
    </Fragment>
  );
};

export default HomePage;
