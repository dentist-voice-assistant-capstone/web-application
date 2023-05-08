import "bootstrap/dist/css/bootstrap.css";
// import LogoutButton from "./LogoutButton";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import classes from "./TopInformationBar.module.css";

function TopInformationBar(props) {
  const isSummary = props.isSummary;
  return (
    <>
      {!isSummary && (
        <div className={classes["navbar"]}>
          <Navbar bg="black" variant="dark" fixed="top">
            <Container>
              <Navbar.Brand className={classes.actions}>
                <div className={classes["content-left"]}>
                  {"Dentist ID: "}
                  {props.dentistID}
                </div>
                <div className={classes["content-center"]}>
                  {"Patient ID: "}
                  {props.patientID}
                </div>

                <div className={classes["content-right"]}>
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
