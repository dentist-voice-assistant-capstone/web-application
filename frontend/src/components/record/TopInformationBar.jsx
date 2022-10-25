import { useState, useContext, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
// import LogoutButton from "./LogoutButton";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import AuthContext from "../../store/auth-context";
import { fetchUserInfoAPIHandler } from "../../utils/apiHandler";
import classes from "./TopInformationBar.module.css";

function TopInformationBar(props) {
  console.log(props);

  // states for handling initial fetching user's data
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const [userData, setUserData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const current = new Date();
  const date = `${current.getDate()}/${
    current.getMonth() + 1
  }/${current.getFullYear()}`;

  // fetching user data, when loaded page =========================
  useEffect(() => {
    fetchUserInfoAPIHandler(token, setUserData, setIsLoaded);
  }, [token]);
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
    <Navbar bg="black" variant="dark">
      <Container>
        {/* {isLoaded && (
          <Navbar.Brand className={classes.actions}>
            {userData.email}
          </Navbar.Brand>
        )}
        {isLoaded && <LogoutButton></LogoutButton>} */}
        {isLoaded && (
          <Navbar.Brand className={classes.actions}>
            <div>
              {"dentistID: "}
              {userData.dentistID}
            </div>

            <div>{date}</div>
          </Navbar.Brand>
        )}
      </Container>
    </Navbar>
  );
}

export default TopInformationBar;
