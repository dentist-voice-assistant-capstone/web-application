import { useState, useContext, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
// import LogoutButton from "./LogoutButton";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import AuthContext from "../../store/auth-context";
import { fetchUserInfoAPIHandler } from "../../utils/apiHandler";
import classes from "./TopInformationBar.module.css";

function TopInformationBar(props) {
  // states for handling initial fetching user's data
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const [patienceData] = useState("55555555");
  const [isLoaded, setIsLoaded] = useState(false);

  const current = new Date();
  const date = `${current.getDate()}/${
    current.getMonth() + 1
  }/${current.getFullYear()}`;

  // // fetching user data, when loaded page =========================
  // useEffect(() => {
  //   fetchUserInfoAPIHandler(token, setUserData, setIsLoaded);
  // }, [token]);
  // =============================================================

  return (
    // <Navbar bg="light">
    //   <Container>
    //     <Navbar.Brand>Brand link</Navbar.Brand>
    //     <Nav className="me-auto">
    //       <LogoutButton></LogoutButton>
    //     </Nav>
    //   </Container>
    // </Navbar>
    <Navbar bg="black" variant="dark" fixed="top">
      <Container>
        {isLoaded && (
          <Navbar.Brand className={classes.actions}>
            <div>
              {"Dentist ID: "}
              {props.userData.dentistID}
            </div>

            <div className="patienceID">
              {"Patience ID: "}
              {patienceData}
            </div>

            <div>
              {"Date: "}
              {date}
            </div>
          </Navbar.Brand>
        )}
      </Container>
    </Navbar>
  );
}

export default TopInformationBar;
