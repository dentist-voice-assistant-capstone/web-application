import useInput from "../../hooks/use-input";
import {
  validateEmptyInput,
  validateLength,
  validateOldandNewPassword,
  validateConfirmPassword,
} from "../../utils/validator";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
} from "../../utils/constants";
import { BsFillInfoCircleFill } from "react-icons/bs";

import classes from "./AccountEditForm.module.css";

const PasswordEditForm = (props) => {
  const {
    value: enteredOldPassword,
    isValueValid: isOldPasswordValid,
    hasError: hasOldPasswordError,
    errorMessage: errorMessageOldPassword,
    valueChangeHandler: oldPasswordChangeHandler,
    inputBlurHandler: oldPasswordBlurHandler,
    reset: resetOldPassword,
  } = useInput("Password", [validateEmptyInput], {});

  const {
    value: enteredNewPassword,
    isValueValid: isNewPasswordValid,
    hasError: hasNewPasswordError,
    errorMessage: errorMessageNewPassword,
    valueChangeHandler: newPasswordChangeHandler,
    inputBlurHandler: newPasswordBlurHandler,
    reset: resetNewPassword,
  } = useInput("Password", [validateLength, validateOldandNewPassword], {
    password: enteredOldPassword,
    minLength: PASSWORD_MIN_LENGTH,
    maxLength: PASSWORD_MAX_LENGTH,
  });

  const {
    value: enteredConfirmNewPassword,
    isValueValid: isConfirmNewPasswordValid,
    hasError: hasConfirmNewPasswordError,
    errorMessage: errorMessageConfirmNewPassword,
    valueChangeHandler: confirmNewPasswordChangeHandler,
    inputBlurHandler: confirmNewPasswordBlurHandler,
    reset: resetConfirmNewPassword,
  } = useInput("Password", [validateConfirmPassword], {
    password: enteredNewPassword,
  });

  let isFormValid = false;
  if (isOldPasswordValid && isNewPasswordValid && isConfirmNewPasswordValid) {
    isFormValid = true;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const userPasswordUpdateData = {
      oldPassword: enteredOldPassword,
      newPassword: enteredNewPassword,
      confirmNewPassword: enteredConfirmNewPassword,
    };
    console.log(userPasswordUpdateData);
    props.onSaveClick(userPasswordUpdateData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        className={`${classes["account-edit__form-items"]} ${
          hasOldPasswordError ? classes["invalid"] : ""
        }`}
      >
        <label htmlFor="oldPassword">Old Password</label>
        <br />
        <input
          type="password"
          name="oldPassword"
          value={enteredOldPassword}
          onChange={oldPasswordChangeHandler}
          onBlur={oldPasswordBlurHandler}
        ></input>
      </div>

      <p
        style={{
          color:
            hasNewPasswordError &&
            errorMessageNewPassword !==
              "New password should not be same as old password."
              ? "red"
              : "",
        }}
      >
        <BsFillInfoCircleFill /> Password should have 8-12 characters length.
      </p>

      <div
        className={`${classes["account-edit__form-items"]} ${
          hasNewPasswordError ? classes["invalid"] : ""
        }`}
      >
        <label htmlFor="newPassword">New Password</label>
        <br />
        <input
          type="password"
          name="newPassword"
          value={enteredNewPassword}
          onChange={newPasswordChangeHandler}
          onBlur={newPasswordBlurHandler}
        ></input>
        {hasNewPasswordError &&
          errorMessageNewPassword !==
            "Password length must be between 8-12 characters." && (
            <p className={classes["error"]}>{errorMessageNewPassword}</p>
          )}
      </div>

      <div
        className={`${classes["account-edit__form-items"]} ${
          hasConfirmNewPasswordError ? classes["invalid"] : ""
        }`}
      >
        <label htmlFor="confirmNewPassword">Confirm New Password</label>
        <br />
        <input
          type="password"
          name="confirmNewPassword"
          value={enteredConfirmNewPassword}
          onChange={confirmNewPasswordChangeHandler}
          onBlur={confirmNewPasswordBlurHandler}
        ></input>
        {hasConfirmNewPasswordError && (
          <p className={classes["error"]}>{errorMessageConfirmNewPassword}</p>
        )}
      </div>

      {/* Actions */}
      {/* Save Change button -> submit button */}
      <div className={classes["account-edit__from-actions"]}>
        <button
          type="submit"
          className={classes["save"]}
          disabled={!isFormValid}
        >
          Save Change
        </button>
      </div>
    </form>
  );
};

export default PasswordEditForm;
