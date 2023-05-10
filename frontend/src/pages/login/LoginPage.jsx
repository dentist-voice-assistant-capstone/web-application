import LoginForm from "../../components/login/LoginForm";
import LoginBottom from "../../components/login/LoginBottom";
import classes from "./LoginPage.module.css";
import { userLoginAPIHandler } from "../../utils/userAPIHandler";
import { useNavigate } from "react-router-dom";
import { Fragment, useState, useContext } from "react";
import Modal from "../../components/ui/Modal";
import AuthContext from "../../store/auth-context";
import NavBar from "../../components/ui/NavBar";

const LoginPage = () => {
  // [Detect between production mode or development mode]
  // if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  //   console.log("DEV MODE", process.env.REACT_APP_BACKEND_PORT)
  // } else {
  //   console.log("PROD MODE", process.env.REACT_APP_BACKEND_PORT)
  // }

  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const [loginError, setLoginError] = useState();

  function loginHandler(loginData) {
    // console.log(loginData);
    // Parameter: x milliseconds login session time (15 days)
    const session_time = 15 * 24 * 60 * 60 * 1000;
    // Send a post request
    userLoginAPIHandler(
      loginData,
      setLoginError,
      authCtx,
      session_time,
      navigate
    );
  }

  const errorModalOkHandler = () => {
    setLoginError();
  };

  return (
    <Fragment>
      {loginError && (
        <Modal
          header={loginError.header}
          content={loginError.content}
          onOKClick={errorModalOkHandler}
          modalType="error"
        />
      )}
      <div className="landing-page">
        <NavBar isLoaded={false}></NavBar>
        <div className={classes["image-section"]}>
          <div className="centered">
            <div className={classes.login}>
              <div className={classes.login_label}>Login</div>
              <LoginForm onLogin={loginHandler} />
              <LoginBottom />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default LoginPage;
