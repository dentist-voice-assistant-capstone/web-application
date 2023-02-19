import { useState, useContext, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
// import LogoutButton from "./LogoutButton";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import AuthContext from "../../store/auth-context";
import { fetchUserInfoAPIHandler } from "../../utils/apiHandler";
import classes from "./TopInformationBar.module.css";

function TopInformationBar(props) {
  const isSummary = props.isSummary;
  console.log(isSummary);
  return (
    <Navbar bg="black" variant="dark" fixed="top">
      <Container>
        {!isSummary && (
          <Navbar.Brand className={classes.actions}>
            <div>
              {"Dentist ID: "}
              {props.dentistID}
            </div>

            <div className="patienceID">
              {"Patience ID: "}
              {props.patienceID}
            </div>

            <div>
              {"Date: "}
              {props.date}
            </div>
          </Navbar.Brand>
        )}
        {isSummary && (
          <Navbar.Brand className={classes.actions}>
            <div></div>
            <div className={classes["back-to-home-page"]}>
              <button onClick={props.checkBackToHomeHandler}>
                Back to Home Page
              </button>
            </div>
            <div></div>
          </Navbar.Brand>
        )}
      </Container>
    </Navbar>
  );
}

export default TopInformationBar;
