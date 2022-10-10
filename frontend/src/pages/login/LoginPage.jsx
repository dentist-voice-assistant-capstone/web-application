import LoginForm from "../../components/login/LoginForm";
import LoginBottom from "../../components/login/LoginBottom";
import classes from "./LoginPage.module.css";
import { userLoginAPIHandler } from "../../utils/apiHandler";
import { useNavigate } from "react-router-dom";
import { Fragment, useState } from "react";
import ErrorModal from "../../components/ui/ErrorModal";

const LoginPage = () => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState();

  function loginHandler(loginData) {
    console.log(loginData);
    // Send a post request
    userLoginAPIHandler(loginData, setLoginError, navigate);
  }

  const errorModalOkHandler = () => {
    setLoginError();
  };

  return (
    <Fragment>
      {loginError && (
        <ErrorModal
          header={loginError.header}
          content={loginError.content}
          onOKClick={errorModalOkHandler}
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
