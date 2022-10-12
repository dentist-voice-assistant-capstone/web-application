import classes from "./NavBar.module.css";
import "bootstrap/dist/css/bootstrap.css";
import LogoutButton from "./LogoutButton";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

function NavBar(props) {
  console.log(props);
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
        <Navbar.Brand className={classes.actions}>{props.email}</Navbar.Brand>
        <LogoutButton></LogoutButton>
      </Container>
    </Navbar>
  );
}

export default NavBar;
