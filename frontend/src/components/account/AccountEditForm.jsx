import useInput from "../../hooks/use-input";
import {
  validateMaxLength,
  validateEnglishLetter,
} from "../../utils/validator";
import { NAME_MAX_LENGTH } from "../../utils/constants";

import classes from "./AccountEditForm.module.css";

const AccountEditForm = (props) => {
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
    defaultValue: "test@hotmail.com",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    props.onSaveClick();
    console.log("handleSubmit detected!");
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Inputs */}
      <div className={classes["account-edit__form-items"]}>
        <label>Email</label>
        <br />
        <p>test@hotmail.com</p>
      </div>

      <div className={classes["account-edit__form-items"]}>
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
      </div>

      <div className={classes["account-edit__form-items"]}>
        <label>Surname</label>
        <br />
        <input
          disabled={!props.isEditing}
          placeholder="test surname"
          type="text"
        ></input>
      </div>

      <div className={classes["account-edit__form-items"]}>
        <label>Dentist ID</label>
        <br />
        <input
          disabled={!props.isEditing}
          placeholder="test dentist ID"
          type="text"
        ></input>
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
        >
          Save Change
        </button>
      </div>
    </form>
  );
};

export default AccountEditForm;
