import LoginForm from "../../components/login/LoginForm";
import LoginBottom from "../../components/login/LoginBottom";
import classes from "./LoginPage.module.css";
import { userLoginAPIHandler } from "../../utils/apiHandler";
import { useNavigate } from "react-router-dom";
import { Fragment, useState, useContext } from "react";
import Modal from "../../components/ui/Modal";
import AuthContext from "../../store/auth-context";

const LoginPage = () => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const [loginError, setLoginError] = useState();

  function loginHandler(loginData) {
    console.log(loginData);
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
        <div className="centered">
          <div className={classes.login}>
            <div className={classes.login_label}>Login</div>
            <LoginForm onLogin={loginHandler} />
            <LoginBottom />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default LoginPage;
