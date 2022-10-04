import useInput from "../../hooks/use-input";
import "./RegisterForm.css";

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 12;

const NAME_MAX_LENGTH = 45;
const SURNAME_MAX_LENGTH = 45;
const DENTISTID_MAX_LENGTH = 45;

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

const validateMaxLength = (value, maxLength) => {
  return {
    isPass: value.length <= maxLength,
    defaultErrorMessage: `length must not be longer than ${maxLength} characters.`,
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
  } = useInput("Password", [validateEmptyInput, validateLength], {
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
  } = useInput("Password", [validateEmptyInput, validateConfirmPassword], {
    password: enteredPassword,
  });

  const {
    value: enteredName,
    isValueValid: isNameValid,
    hasError: hasNameError,
    errorMessage: errorMessageName,
    valueChangeHandler: nameChangeHandler,
    inputBlurHandler: nameBlurHandler,
    reset: resetName,
  } = useInput("Name", [validateMaxLength], { maxLength: NAME_MAX_LENGTH });

  const {
    value: enteredSurname,
    isValueValid: isSurnameValid,
    hasError: hasSurnameError,
    errorMessage: errorMessageSurname,
    valueChangeHandler: surnameChangeHandler,
    inputBlurHandler: surnameBlurHandler,
    reset: resetSurname,
  } = useInput("Surname", [validateMaxLength], {
    maxLength: SURNAME_MAX_LENGTH,
  });

  const {
    value: enteredDentistId,
    isValueValid: isDentistIdValid,
    hasError: hasDentistIdError,
    errorMessage: errorMessageDentistId,
    valueChangeHandler: dentistIdChangeHandler,
    inputBlurHandler: dentistIdBlurHandler,
    reser: resetDentistID,
  } = useInput("Dentist ID", [validateMaxLength], {
    maxLength: DENTISTID_MAX_LENGTH,
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
            {/* Email */}
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
            {/* Password */}
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
            {/* Confirm Password */}
            <li
              className={`register-form__items ${stypeInputClasses(
                isConfirmPasswordValid,
                hasConfirmPasswordError
              )}`}
            >
              <label htmlFor="confirmpassword">
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
              {/* Name */}
              <li
                className={`register-form__items ${
                  enteredName.trim().length !== 0
                    ? stypeInputClasses(isNameValid, hasNameError)
                    : ""
                }`}
              >
                <label htmlFor="name">Name</label>
                <div>
                  <input
                    type="text"
                    name="name"
                    maxLength={NAME_MAX_LENGTH}
                    value={enteredName}
                    onChange={nameChangeHandler}
                    onBlur={nameBlurHandler}
                  />
                  {hasNameError && <p className="error">{errorMessageName}</p>}
                </div>
              </li>
              {/* Surname */}
              <li
                className={`register-form__items ${
                  enteredSurname.trim().length !== 0
                    ? stypeInputClasses(isSurnameValid, hasSurnameError)
                    : ""
                }`}
              >
                <label htmlFor="surname">Surname</label>
                <div>
                  <input
                    type="text"
                    name="surname"
                    maxLength={SURNAME_MAX_LENGTH}
                    value={enteredSurname}
                    onChange={surnameChangeHandler}
                    onBlur={surnameBlurHandler}
                  />
                  {hasSurnameError && (
                    <p className="error">{errorMessageSurname}</p>
                  )}
                </div>
              </li>
              {/* Dentist ID */}
              <li
                className={`register-form__items ${
                  enteredDentistId.trim().length !== 0
                    ? stypeInputClasses(isDentistIdValid, hasDentistIdError)
                    : ""
                }`}
              >
                <label htmlFor="dentistId">Dentist ID</label>
                <div>
                  <input
                    type="text"
                    name="dentistId"
                    maxLength={DENTISTID_MAX_LENGTH}
                    value={enteredDentistId}
                    onChange={dentistIdChangeHandler}
                    onBlur={dentistIdBlurHandler}
                  />
                  {hasDentistIdError && (
                    <p className="error">{errorMessageDentistId}</p>
                  )}
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
