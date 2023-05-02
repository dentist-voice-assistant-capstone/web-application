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

  function editAccountMenuOnClickHandler() {
    navigate("/account/edit");
  }

  function loginMenuOnClickHandler() {
    navigate("/login");
  }

  function registerMenuOnClickHandler() {
    navigate("/register");
  }

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
      {/* <Container> */}
      <Navbar.Brand className={classes.actions}>
        {props.isSummary && (
          <div className={classes["content-left"]}>
            <FaHome
              className={classes["home-icon"]}
              size={"3vh"}
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
          // <div className={classes["content-center"]}>
          //   {props.userData.email}
          // </div>
          <div className={classes["content-right"]}>
            <div className={classes["right-component"]}>
              {!!props.userData ? props.userData.email : ""}
            </div>
            {props.isEditEnable && (
              <button
                className={classes["right-component"]}
                onClick={editAccountMenuOnClickHandler}
              >
                Account Edit
              </button>
            )}
            <LogoutButton className={classes["right-component"]} />
          </div>
        )}

        {!props.isLoaded && (
          <div className={classes["content-right"]}>
            <button
              className={classes["right-component"]}
              onClick={loginMenuOnClickHandler}
            >
              Sign In
            </button>
            <button
              className={classes["right-component"]}
              onClick={registerMenuOnClickHandler}
            >
              Sign Up
            </button>
          </div>
        )}
      </Navbar.Brand>
      {/* </Container> */}
    </Navbar>
  );
}

export default NavBar;
