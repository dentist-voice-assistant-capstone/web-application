import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import classes from "./NavBar.module.css";
import "bootstrap/dist/css/bootstrap.css";
import LogoutButton from "./LogoutButton";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

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
              {/* <button onClick={props.checkBackToHomeHandler}>Home</button> */}
              <button>
                {!isMouseOver && (
                  <img
                    src={require("../../../src/house-48.png")}
                    onClick={props.checkBackToHomeHandler}
                    onMouseEnter={mouseEnterHandler}
                  />
                )}
                {isMouseOver && (
                  <img
                    src={require("../../../src/house-48-yellow.png")}
                    onClick={props.checkBackToHomeHandler}
                    onMouseLeave={mouseEnterHandler}
                  />
                )}
              </button>
            </div>
          )}
          {!props.isSummary && (
            <div className={classes["content-left"]}>
              {/* <button onClick={homeMenuOnClickHandler}>Home</button> */}
              <button className={classes["home-icon"]}>
                {!isMouseOver && (
                  <img
                    src={require("../../../src/house-48.png")}
                    onClick={homeMenuOnClickHandler}
                    onMouseEnter={mouseEnterHandler}
                  />
                )}
                {isMouseOver && (
                  <img
                    src={require("../../../src/house-48-yellow.png")}
                    onClick={homeMenuOnClickHandler}
                    onMouseLeave={mouseEnterHandler}
                  />
                )}
              </button>
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
