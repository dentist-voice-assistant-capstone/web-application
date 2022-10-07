// import useInput from "../../hooks/use-input";
import classes from "./LoginForm.module.css";
import { useRef } from "react";
// import {
//   validateEmptyInput,
//   validateEmail,
//   validateLength,
// } from "../../utils/validator";

// const PASSWORD_MIN_LENGTH = 8;
// const PASSWORD_MAX_LENGTH = 12;

function LoginForm(props) {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  // const {
  //   value: enteredEmail,
  //   isValueValid: isEmailValid,
  //   hasError: hasEmailError,
  //   errorMessage: errorMessageEmail,
  //   valueChangeHandler: emailChangeHandler,
  //   inputBlurHandler: emailBlurHandler,
  //   // reset: resetEmail,
  // } = useInput("Email", [validateEmptyInput, validateEmail]);

  // const {
  //   value: enteredPassword,
  //   isValueValid: isPasswordValid,
  //   hasError: hasPasswordError,
  //   errorMessage: errorMessagePassword,
  //   valueChangeHandler: passwordChangeHandler,
  //   inputBlurHandler: passwordBlurHandler,
  //   // reset: resetPassword,
  // } = useInput("Password", [validateEmptyInput, validateLength], {
  //   minLength: PASSWORD_MIN_LENGTH,
  //   maxLength: PASSWORD_MAX_LENGTH,
  // });

  // const stypeInputClasses = (isValid, hasError) => {
  //   if (hasError) {
  //     return "invalid";
  //   } else if (isValid) {
  //     return "valid";
  //   } else {
  //     return "";
  //   }
  // };

  // let isFormValid = false;
  // if (isEmailValid && isPasswordValid) {
  //   isFormValid = true;
  // }

  function submitHandler(event) {
    event.preventDefault();

    // if the form still isn't valid, then don't do anything
    // if (!isFormValid) {
    //   return;
    // }

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    const loginData = {
      email: enteredEmail,
      password: enteredPassword,
    };

    props.onLogin(loginData);
  }

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="email">
          Email
        </label>
          <input
            type="email"
            id="email"
            ref={emailInputRef}
            // value={enteredEmail}
            // onChange={emailChangeHandler}
            // onBlur={emailBlurHandler}
          />
          {/* {hasEmailError && <p className="error">{errorMessageEmail}</p>} */}
      </div>
      <div className={classes.control}>
        <label htmlFor="password">
          Password
        </label>
        <input
          type="password"
          id="password"
          ref={passwordInputRef}
          // value={enteredPassword}
          // onChange={passwordChangeHandler}
          // onBlur={passwordBlurHandler}
        />
        {/* {hasPasswordError && <p className="error">{errorMessagePassword}</p>} */}
      </div>

      <div className={classes.actions}>
        <button>Login</button>
      </div>
    </form>
  );
}

export default LoginForm;
