import useInput from "../../hooks/use-input";
import "./RegisterForm.css";
import {
  validateEmptyInput,
  validateEmail,
  validateLength,
  validateConfirmPassword,
  validateMaxLength,
  validateEnglishLetter,
} from "../../utils/validator";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  NAME_MAX_LENGTH,
  SURNAME_MAX_LENGTH,
  DENTISTID_MAX_LENGTH,
} from "../../utils/constants";

const RegisterForm = (props) => {
  const {
    value: enteredEmail,
    isValueValid: isEmailValid,
    hasError: hasEmailError,
    errorMessage: errorMessageEmail,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmail,
  } = useInput("Email", [validateEmptyInput, validateEmail], {
    removeEmailDuplicated: props.setIsEmailDuplicated,
  });

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
  } = useInput("Name", [validateMaxLength, validateEnglishLetter], {
    maxLength: NAME_MAX_LENGTH,
  });

  const {
    value: enteredSurname,
    isValueValid: isSurnameValid,
    hasError: hasSurnameError,
    errorMessage: errorMessageSurname,
    valueChangeHandler: surnameChangeHandler,
    inputBlurHandler: surnameBlurHandler,
    reset: resetSurname,
  } = useInput("Surname", [validateMaxLength, validateEnglishLetter], {
    maxLength: SURNAME_MAX_LENGTH,
  });

  const {
    value: enteredDentistId,
    isValueValid: isDentistIdValid,
    hasError: hasDentistIdError,
    errorMessage: errorMessageDentistId,
    valueChangeHandler: dentistIdChangeHandler,
    inputBlurHandler: dentistIdBlurHandler,
    reset: resetDentistID,
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

  let isFormValid = false;
  if (
    isEmailValid &&
    isPasswordValid &&
    isConfirmPasswordValid &&
    isNameValid &&
    isSurnameValid &&
    isDentistIdValid
  ) {
    isFormValid = true;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    // if the form still isn't valid, then don't do anything
    if (!isFormValid) {
      return;
    }

    // required fields
    const userRegisterData = {
      email: enteredEmail,
      password: enteredPassword,
      confirmPassword: enteredComfirmPassword,
    };
    // optional fields
    if (enteredName.trim().length !== 0)
      userRegisterData.dentistName = enteredName;
    if (enteredSurname.trim().length !== 0)
      userRegisterData.dentistSurname = enteredSurname;
    if (enteredDentistId.trim().length !== 0)
      userRegisterData.dentistID = enteredDentistId;

    // send userRegisterData to RegisterPage.jsx
    props.onRegisterSubmit(userRegisterData);

    // reset input fields if needed
    // resetEmail();
    // resetPassword();
    // resetConfirmPassword();
    // resetName();
    // resetSurname();
    // resetDentistID();
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
              className={`register-form__items ${
                hasEmailError || props.isEmailDuplicated ? "invalid" : ""
              }`}
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
                {hasEmailError && !props.isEmailDuplicated && (
                  <p className="error">{errorMessageEmail}</p>
                )}
                {props.isEmailDuplicated && (
                  <p className="error">This email has already been used.</p>
                )}
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
                  value={enteredPassword}
                  onChange={passwordChangeHandler}
                  onBlur={passwordBlurHandler}
                />
                <p className={hasPasswordError ? "error" : ""}>
                  Password should have 8-12 characters length.
                </p>
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
        <button
          type="submit"
          className="register-form__register-button"
          disabled={!isFormValid}
        >
          Register
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
