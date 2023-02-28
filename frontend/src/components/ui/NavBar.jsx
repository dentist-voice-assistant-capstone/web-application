import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import classes from "./NavBar.module.css";
import "bootstrap/dist/css/bootstrap.css";
import LogoutButton from "./LogoutButton";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

import { FaHome } from "react-icons/fa";

function NavBar(props) {
  const navigate = useNavigate();

  const homeMenuOnClickHandler = () => {
    navigate("/");
  };

  const [hoverClass, setHoverClass] = useState("home-icon");

  const mouseEnterHandler = () => {
    // console.log(isMouseOver);
    setIsMouseOver(!isMouseOver);
    isMouseOver ? setHoverClass("home-icon-hover") : setHoverClass("home-icon");
  };

  const [isMouseOver, setIsMouseOver] = useState(false);

  return (
    // <Navbar bg="black" variant="dark">
    //   <Container>
    //     {props.isLoaded && (
    //       <Navbar.Brand className={classes.actions}>
    //         {props.userData.email}
    //       </Navbar.Brand>
    //     )}
    //     <div>adfasdfasdf</div>
    //     <LogoutButton></LogoutButton>
    //   </Container>
    // </Navbar>
    <Navbar bg="black" variant="dark" fixed="top">
      <Container>
        <Navbar.Brand className={classes.actions}>
          {props.isSummary && (
            <div className={classes["content-left"]}>
              <FaHome
                className={classes["home-icon"]}
                size={40}
                onClick={props.checkBackToHomeHandler}
              />
            </div>
          )}
          {!props.isSummary && (
            <div className={classes["content-left"]}>
              <FaHome
                className={classes["home-icon"]}
                size={40}
                onClick={homeMenuOnClickHandler}
              />
            </div>
          )}

          {props.isLoaded && (
            <div className={classes["content-center"]}>
              {props.userData.email}
            </div>
          )}

          <div className={classes["content-right"]}>
            <LogoutButton />
          </div>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default NavBar;
