import { Fragment } from "react";
import useInput from "../../hooks/use-input";
import {
  validateMaxLength,
  validateIllegalFileNameCharacters,
  validateNoBlankValue
} from "../../utils/validator";
import {
  DENTISTID_MAX_LENGTH,
  PATIENTID_MAX_LENGTH
} from "../../utils/constants"

import classes from "./InputModal.module.css";

const InputModal = (props) => {
  // Dentist ID
  const {
    value: enteredDentistId,
    isValueValid: isDentistIdValid,
    hasError: hasDentistIdError,
    errorMessage: errorMessageDentistId,
    valueChangeHandler: dentistIdChangeHandler,
    inputBlurHandler: dentistIdBlurHandler,
    reset: resetDentistID
  } = useInput("Dentist ID", [validateIllegalFileNameCharacters, validateNoBlankValue, validateMaxLength], {
    maxLength: DENTISTID_MAX_LENGTH,
    defaultValue: props.dentistID
  })

  // Patient ID
  const {
    value: enteredPatientId,
    isValueValid: isPatientIdValid,
    hasError: hasPatientIdError,
    errorMessage: errorMessagePatientId,
    valueChangeHandler: patientIdChangeHandler,
    inputBlurHandler: patientIdBlurHandler,
    reset: resetPatientID
  } = useInput("Patient ID", [validateIllegalFileNameCharacters, validateNoBlankValue, validateMaxLength], {
    maxLength: PATIENTID_MAX_LENGTH
  })

  let isFormValid = false;
  if (isDentistIdValid && isPatientIdValid) {
    isFormValid = true;
  }

  const resetInput = () => {
    resetDentistID()
    resetPatientID()
  }

  // buttons in input_modal actions
  const okButton = (
    <button
      onClick={props.onOKClick}
      className={classes["ok_button"]}
      disabled={!isFormValid}>
      {props.okButtonText || "Continue"}
    </button>
  );
  const cancelButton = (
    <button onClick={() => {
      props.onCancelClick()
      resetInput()
    }}
      className={classes["cancel_button"]}>
      {props.cancelButtonText || "Cancel"}
    </button>
  );

  return (
    <Fragment>
      <div className={classes["backdrop"]}></div>
      <div className={`${classes["input_modal"]} ${classes[props.modalType]}`}>
        {/* modal's header */}
        <header className={classes["input_modal__header"]}>
          <p>{props.header}</p>
        </header>

        {/* modal's content */}
        {/* <div className={classes["modal__content"]}>{props.content}</div> */}
        {/* <div className={classes["input_modal__control"]}>
          <label htmlFor="Dentist-ID">Dentist ID</label>
          <input
            type="Dentist-ID"
            id="Dentist-ID"
            onChange={(e) => props.setDentistID(e.target.value)}
            value={props.dentistID}
          />
        </div>
        <div className={classes["input_modal__control"]}>
          <label htmlFor="Patient-ID">Patient ID</label>
          <input
            type="Patient-ID"
            id="Patient-ID"
            onChange={(e) => props.setPatientID(e.target.value)}
            value={props.patientID}
          />
        </div> */}

        {/* Dentist ID */}
        <div className={`${classes["input_modal__control"]} ${hasDentistIdError ? classes["invalid"] : ""}`}>
          <label htmlFor="dentistId">Dentist ID</label>
          <div>
            <input
              type="text"
              name="dentistId"
              maxLength={DENTISTID_MAX_LENGTH}
              value={enteredDentistId}
              onChange={(e) => {
                props.setDentistID(e.target.value);
                dentistIdChangeHandler(e);
              }}
              onBlur={dentistIdBlurHandler}
            />
            {hasDentistIdError && (
              <p className={"error"}>{errorMessageDentistId}</p>
            )}
          </div>
        </div>

        {/* Patient ID */}
        <div className={`${classes["input_modal__control"]} ${hasPatientIdError ? classes["invalid"] : ""}`}>
          <label htmlFor="patientId">Patient ID</label>
          <div>
            <input
              type="text"
              name="patientId"
              maxLength={PATIENTID_MAX_LENGTH}
              value={enteredPatientId}
              onChange={(e) => {
                props.setPatientID(e.target.value);
                patientIdChangeHandler(e);
              }}
              onBlur={patientIdBlurHandler}
            />
            {hasPatientIdError && (
              <p className={"error"}>{errorMessagePatientId}</p>
            )}
          </div>
        </div>

        {/* input_modal's action bar */}
        <footer className={classes["input_modal__actions"]}>
          {cancelButton}
          {okButton}
        </footer>
      </div>
    </Fragment>
  );
};

export default InputModal;
