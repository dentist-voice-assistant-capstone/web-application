import useInput from "../../hooks/use-input";
import "./RegisterForm.css";

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 12;

const validateEmptyInput = (value) => {
  return {
    isPass: value.trim().length !== 0,
    defaultErrorMessage: "cannot be blank.",
  };
};

const validateEmail = (email) => {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return {
    isPass: emailRegex.test(email),
    defaultErrorMessage: "is invalid.",
  };
};

const validateLength = (value, minLength, maxLength) => {
  return {
    isPass: value.length >= minLength && value.length <= maxLength,
    defaultErrorMessage: `length must be between ${minLength}-${maxLength} characters.`,
  };
};

const validateConfirmPassword = (confirmPassword, password) => {
  return {
    isPass: confirmPassword === password,
    specialErrorMessage: "Password doesn't match.",
  };
};

const RegisterForm = () => {
  const {
    value: enteredEmail,
    isValueValid: isEmailValid,
    hasError: hasEmailError,
    errorMessage: errorMessageEmail,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmail,
  } = useInput("Email", [validateEmptyInput, validateEmail]);

  const {
    value: enteredPassword,
    isValueValid: isPasswordValid,
    hasError: hasPasswordError,
    errorMessage: errorMessagePassword,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    reset: resetPassword,
  } = useInput("Password", [validateLength], {
    minLength: PASSWORD_MIN_LENGTH,
    maxLength: PASSWORD_MAX_LENGTH,
  });

  const {
    value: enteredComfirmPassword,
    isValueValid: isConfirmPasswordValid,
    hasError: hasConfirmPasswordError,
    errorMessage: errorMessageConfirmPassword,
    valueChangeHandler: confirmPasswordChangeHandler,
    inputBlurHandler: confirmPasswordBlurHandler,
    reset: resetConfirmPassword,
  } = useInput("ConfirmPassword", [validateConfirmPassword], {
    password: enteredPassword,
  });

  const stypeInputClasses = (isValid, hasError) => {
    if (hasError) {
      return "invalid";
    } else if (isValid) {
      return "valid";
    } else {
      return "";
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Submit!");
    console.log(enteredEmail);
    console.log(enteredPassword);

    // resetEmail();
    // resetPassword();
    // resetConfirmPassword();
  };

  return (
    <form onSubmit={handleSubmit} className="register-form" noValidate>
      {/* 1) ส่วนกรอกข้อมูล */}
      <div className="register-form__fill_area">
        {/* 1.1) ส่วนกรอกข้อมูล Email and Password */}
        <div className="register-form__sections">
          <div className="register-form__topics">Account Information</div>

          <ul className="register-form__items-list">
            <li
              className={`register-form__items ${stypeInputClasses(
                isEmailValid,
                hasEmailError
              )}`}
            >
              <label htmlFor="email">
                Email<span className="required">*</span>
              </label>
              <div>
                <input
                  type="email"
                  name="email"
                  value={enteredEmail}
                  onChange={emailChangeHandler}
                  onBlur={emailBlurHandler}
                />
                {hasEmailError && <p className="error">{errorMessageEmail}</p>}
              </div>
            </li>

            <li
              className={`register-form__items ${stypeInputClasses(
                isPasswordValid,
                hasPasswordError
              )}`}
            >
              <label htmlFor="password">
                Password<span className="required">*</span>
              </label>
              <div>
                <input
                  type="password"
                  name="password"
                  maxLength={PASSWORD_MAX_LENGTH}
                  value={enteredPassword}
                  onChange={passwordChangeHandler}
                  onBlur={passwordBlurHandler}
                />
                {hasPasswordError && (
                  <p className="error">{errorMessagePassword}</p>
                )}
              </div>
            </li>
            <li
              className={`register-form__items ${stypeInputClasses(
                isConfirmPasswordValid,
                hasConfirmPasswordError
              )}`}
            >
              <label>
                Confirm<span className="required">*</span>
                <br />
                Password
              </label>
              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  maxLength={PASSWORD_MAX_LENGTH}
                  value={enteredComfirmPassword}
                  onChange={confirmPasswordChangeHandler}
                  onBlur={confirmPasswordBlurHandler}
                />
                {hasConfirmPasswordError && (
                  <p className="error">{errorMessageConfirmPassword}</p>
                )}
              </div>
            </li>
          </ul>
        </div>

        {/* 1.2) ส่วนกรอกข้อมูลทั่วไป */}
        <div>
          <div className="register-form__sections">
            <div className="register-form__topics">General Information</div>
            <ul className="register-form__items-list">
              <li className="register-form__items">
                <label>First Name</label>
                <div>
                  <input type="text" name="firstName" />
                </div>
              </li>

              <li className="register-form__items">
                <label>Last Name</label>
                <div>
                  <input type="text" name="lastName" />
                </div>
              </li>

              <li className="register-form__items">
                <label>Dentist ID</label>
                <div>
                  <input type="text" name="dentistID" />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ส่วน submit button */}
      <div className="register-form__submit-area">
        <button type="submit" className="register-form__register-button">
          Register
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
