import LoginForm from "../../components/login/LoginForm";
import LoginBottom from "../../components/login/LoginBottom";
import classes from "./LoginPage.module.css";
// import { useHistory } from "react-router-dom";

const LoginPage = () => {
  // const history = useHistory()

  function loginHandler(loginData) {
    console.log(loginData);

    // Send a post request
  }

  return (
    <div className={classes.landing_page}>
      <div className={classes.centered}>
        <div className={classes.login}>
          <div className={classes.login_label}>Login</div>
          <LoginForm onLogin={loginHandler} />
          <LoginBottom />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
