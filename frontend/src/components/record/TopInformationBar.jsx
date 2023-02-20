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
  return (
    <>
      {" "}
      {!isSummary && (
        <div className={classes["navbar"]}>
          <Navbar bg="black" variant="dark" fixed="top">
            <Container>
              <Navbar.Brand className={classes.actions}>
                <div className={classes["content"]}>
                  {"Dentist ID: "}
                  {props.dentistID}
                </div>
                <div className={classes["content"]}>
                  {"Patience ID: "}
                  {props.patienceID}
                </div>

                <div className={classes["content"]}>
                  {"Date: "}
                  {props.date}
                </div>
              </Navbar.Brand>
            </Container>
          </Navbar>
        </div>
      )}
      {isSummary && (
        <div
          className={classes["navbar-summary"]}
          onClick={props.checkBackToHomeHandler}
        >
          <Navbar
            className="justify-content-center"
            bg="transparent"
            variant="transparent"
            fixed="top"
          >
            <div className={classes["back-home-bar"]}> Back to Home Page</div>
          </Navbar>
        </div>
      )}
    </>
  );
}

export default TopInformationBar;
