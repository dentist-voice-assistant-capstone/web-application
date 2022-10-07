import RegisterForm from "../../components/register/RegisterForm";
import ErrorModal from "../../components/ui/ErrorModal";
import { Fragment } from "react";
import "./RegisterPage.css";

const RegisterPage = () => {
  const registerSubmitHandler = (userRegisterData) => {
    console.log(userRegisterData);

    // TODO: send a POST request
  };

  return (
    <Fragment>
      <ErrorModal
        header="Register Failed"
        content="The email 6231340921@student.chula.ac.th has already been used.
        Please try again using another email."
      />
      <div className="landing-page">
        <div className="register centered">
          <div className="register__label">Register</div>
          <RegisterForm onRegisterSubmit={registerSubmitHandler} />
          <div className="register__login">
            Already have an account? <a href="/login">LOGIN HERE</a>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default RegisterPage;
