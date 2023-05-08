import useInput from "../../hooks/use-input";
import Validator from "../../utils/validator";
// import {
//   validateMaxLength,
//   validateEnglishLetter,
//   validateIllegalFileNameCharacters,
//   validateNoBlankValue
// } from "../../utils/validator";
import {
  NAME_MAX_LENGTH,
  SURNAME_MAX_LENGTH,
  DENTISTID_MAX_LENGTH,
} from "../../utils/constants";

import classes from "./AccountEditForm.module.css";

const AccountEditForm = (props) => {
  const userDefaultData = props.userDefaultData;

  const validateNameMaxLength = new Validator("validateMaxLength", { maxLength: NAME_MAX_LENGTH })
  const validateSurNameMaxLength = new Validator("validateMaxLength", { maxLength: SURNAME_MAX_LENGTH })
  const validateDentistIdMaxLength = new Validator("validateMaxLength", { maxLength: DENTISTID_MAX_LENGTH })
  const validateEnglishLetter = new Validator("validateEnglishLetter")
  const validateNoBlankValue = new Validator("validateNoBlankValue")
  const validateIllegalFileNameCharacters = new Validator("validateIllegalFileNameCharacters")

  const {
    value: enteredName,
    isValueValid: isNameValid,
    hasError: hasNameError,
    errorMessage: errorMessageName,
    valueChangeHandler: nameChangeHandler,
    inputBlurHandler: nameBlurHandler,
    reset: resetName,
  } = useInput("Name", [validateNameMaxLength, validateEnglishLetter], {
    defaultValue: userDefaultData.dentistName
  });

  const {
    value: enteredSurname,
    isValueValid: isSurnameValid,
    hasError: hasSurnameError,
    errorMessage: errorMessageSurname,
    valueChangeHandler: surnameChangeHandler,
    inputBlurHandler: surnameBlurHandler,
    reset: resetSurname,
  } = useInput("Surname", [validateSurNameMaxLength, validateEnglishLetter], {
    defaultValue: userDefaultData.dentistSurname
  });

  const {
    value: enteredDentistId,
    isValueValid: isDentistIdValid,
    hasError: hasDentistIdError,
    errorMessage: errorMessageDentistId,
    valueChangeHandler: dentistIdChangeHandler,
    inputBlurHandler: dentistIdBlurHandler,
    reset: resetDentistID,
  } = useInput("Dentist ID", [validateIllegalFileNameCharacters, validateNoBlankValue, validateDentistIdMaxLength], {
    defaultValue: userDefaultData.dentistID
  });

  let isFormValid = false;
  if (isNameValid && isSurnameValid && isDentistIdValid) {
    isFormValid = true;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    // if the form still isn't valid, then don't do anything
    if (!isFormValid) {
      return;
    }

    const enteredUserData = {
      dentistName: enteredName.trim(),
      dentistSurname: enteredSurname.trim(),
      dentistID: enteredDentistId.trim(),
    };

    // if the updated value differs from the original value, add to the userProfileUpdateData
    const userProfileUpdateData = {};
    for (const field in enteredUserData) {
      if (enteredUserData[field] !== userDefaultData[field]) {
        userProfileUpdateData[field] = enteredUserData[field];
      }
    }
    if (Object.keys(userProfileUpdateData).length === 0) {
      // no updated fields --> same as click cancel
      props.onCancelClick();
    } else {
      // there are updated fields --> call function to send request
      props.onSaveClick(userProfileUpdateData);
    }
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
        className={`${classes["account-edit__form-items"]} ${hasNameError ? classes["invalid"] : ""
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
        className={`${classes["account-edit__form-items"]} ${hasSurnameError ? classes["invalid"] : ""
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
        className={`${classes["account-edit__form-items"]} ${hasDentistIdError ? classes["invalid"] : ""
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
