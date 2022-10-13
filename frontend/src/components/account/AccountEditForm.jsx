import useInput from "../../hooks/use-input";
import {
  validateMaxLength,
  validateEnglishLetter,
} from "../../utils/validator";
import {
  NAME_MAX_LENGTH,
  SURNAME_MAX_LENGTH,
  DENTISTID_MAX_LENGTH,
} from "../../utils/constants";

import classes from "./AccountEditForm.module.css";
import "../../index.css";

const AccountEditForm = (props) => {
  const userDefaultData = props.userDefaultData;

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
    defaultValue: userDefaultData.name,
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
    defaultValue: userDefaultData.surname,
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
    defaultValue: userDefaultData.dentistID,
  });

  let isFormValid = false;
  if (isNameValid && isSurnameValid && isDentistIdValid) {
    isFormValid = true;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    props.onSaveClick();
    console.log("handleSubmit detected!");
  };

  const handleCancel = () => {
    // reset back to its previous value
    resetName();
    resetSurname();
    resetDentistID();
    props.onCancelClick();
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Inputs */}
      <div className={classes["account-edit__form-items"]}>
        <label>Email</label>
        <br />
        <p className={classes["data"]}>{userDefaultData.email}</p>
      </div>

      <div
        className={`${classes["account-edit__form-items"]} ${
          hasNameError ? classes["invalid"] : ""
        }`}
      >
        <label htmlFor="name">Name</label>
        <br />
        <input
          type="text"
          name="name"
          maxLength={NAME_MAX_LENGTH}
          value={enteredName}
          onChange={nameChangeHandler}
          onBlur={nameBlurHandler}
          disabled={!props.isEditing}
        ></input>
        {hasNameError && <p className={classes["error"]}>{errorMessageName}</p>}
      </div>

      <div
        className={`${classes["account-edit__form-items"]} ${
          hasSurnameError ? classes["invalid"] : ""
        }`}
      >
        <label htmlFor="surname">Surname</label>
        <br />
        <input
          type="text"
          name="surname"
          maxLength={SURNAME_MAX_LENGTH}
          value={enteredSurname}
          onChange={surnameChangeHandler}
          onBlur={surnameBlurHandler}
          disabled={!props.isEditing}
        ></input>
        {hasSurnameError && (
          <p className={classes["error"]}>{errorMessageSurname}</p>
        )}
      </div>

      <div
        className={`${classes["account-edit__form-items"]} ${
          hasDentistIdError ? classes["invalid"] : ""
        }`}
      >
        <label htmlFor="dentistId">Dentist ID</label>
        <br />
        <input
          type="text"
          name="dentistId"
          maxLength={DENTISTID_MAX_LENGTH}
          value={enteredDentistId}
          onChange={dentistIdChangeHandler}
          onBlur={dentistIdBlurHandler}
          disabled={!props.isEditing}
        ></input>

        {hasDentistIdError && (
          <p className={classes["error"]}>{errorMessageDentistId}</p>
        )}
      </div>

      {/* Actions */}
      <div className={classes["account-edit__from-actions"]}>
        {/* Edit button */}
        {!props.isEditing && (
          <button
            type="button"
            className={classes["edit"]}
            onClick={props.onEditClick}
          >
            Edit
          </button>
        )}
        {/* Save Change button -> submit button */}
        <button
          type="submit"
          className={classes["save"]}
          hidden={!props.isEditing}
          disabled={!isFormValid}
        >
          Save Change
        </button>

        {/* Cancel button */}
        {props.isEditing && (
          <button
            type="button"
            className={classes["cancel"]}
            onClick={handleCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default AccountEditForm;
