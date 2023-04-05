import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";

import RegisterForm from "../../components/register/RegisterForm";
import Modal from "../../components/ui/Modal";
import { userRegisterAPIHandler } from "../../utils/apiHandler";
import NavBar from "../../components/ui/NavBar";

import classes from "./RegisterPage.module.css";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [isEmailDuplicated, setIsEmailDuplicated] = useState(false);
  // registerError is an object, keys: header, content --> render in "Modal Element"
  const [registerError, setRegisterError] = useState();

  const registerSubmitHandler = (userRegisterData) => {
    // send a POST request
    userRegisterAPIHandler(
      userRegisterData,
      setRegisterError,
      setIsEmailDuplicated,
      navigate
    );
  };

  const errorModalOkHandler = () => {
    // clear register error after click "OK" button or backdrop in ErrorModal
    setRegisterError();
  };

  return (
    <Fragment>
      {registerError && (
        <Modal
          header={registerError.header}
          content={registerError.content}
          onOKClick={errorModalOkHandler}
          modalType="error"
        />
      )}
      <div className="landing-page">
        <NavBar isLoaded={false}></NavBar>
        <div className={classes["image-section"]}>
          <div className="centered">
            <div className={classes.register}>
              <div className={classes["register__label"]}>Register</div>
              <RegisterForm
                onRegisterSubmit={registerSubmitHandler}
                isEmailDuplicated={isEmailDuplicated}
                setIsEmailDuplicated={setIsEmailDuplicated}
              />
              <div className={classes["register__login"]}>
                Already have an account? <a href="/login">LOGIN HERE</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default RegisterPage;
