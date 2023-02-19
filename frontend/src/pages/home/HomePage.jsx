import classes from "./HomePage.module.css";
import NavBar from "../../components/ui/NavBar";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { startAPIHandler } from "../../utils/apiHandler";

const HomePage = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [patienceID, setPatienceID] = useState("123456");
  const [dentistID, setDentistID] = useState("654321");
  function startHandler() {
    startAPIHandler(); // just console.log("starting")
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
    <div className="landing-page">
      {/* <div className={classes["navbar"]}> */}
      <NavBar
        email={"email"}
        userData={userData}
        setUserData={setUserData}
      ></NavBar>
      {/* </div> */}
      <div className={classes.actions}>
        <button onClick={startHandler}>Start</button>
      </div>
      <div className={classes.actions}>
        <button onClick={editAccountMenuOnClickHandler}>Account Edit</button>
      </div>
    </div>
  );
};

export default HomePage;
