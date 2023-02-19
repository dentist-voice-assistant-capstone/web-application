import { useState, useContext, useEffect } from "react";
import classes from "./NavBar.module.css";
import "bootstrap/dist/css/bootstrap.css";
import LogoutButton from "./LogoutButton";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import AuthContext from "../../store/auth-context";
import { fetchUserInfoAPIHandler } from "../../utils/apiHandler";

function NavBar(props) {
  // states for handling initial fetching user's data
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const [isLoaded, setIsLoaded] = useState(false);

  // fetching user data, when loaded page =========================
  useEffect(() => {
    fetchUserInfoAPIHandler(token, props.setUserData, setIsLoaded);
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
        {isLoaded && (
          <Navbar.Brand className={classes.actions}>
            {props.userData.email}
          </Navbar.Brand>
        )}
        {isLoaded && <LogoutButton></LogoutButton>}
      </Container>
    </Navbar>
  );
}

export default NavBar;
