import { Fragment } from "react";

import classes from "./InputModal.module.css";

const InputModal = (props) => {
  // buttons in input_modal actions
  const okButton = (
    <button onClick={props.onOKClick} className={classes["ok_button"]}>
      {props.okButtonText || "Continue"}
    </button>
  );
  const cancelButton = (
    <button onClick={props.onCancelClick} className={classes["cancel_button"]}>
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
        <div className={classes["input_modal__control"]}>
          <label htmlFor="Dentist-ID">Dentist ID</label>
          <input
            type="Dentist-ID"
            id="Dentist-ID"
            onChange={(e) => props.setDentistID(e.target.value)}
            value={props.dentistID}
          />
        </div>
        <div className={classes["input_modal__control"]}>
          <label htmlFor="Patience-ID">Patience ID</label>
          <input
            type="Patience-ID"
            id="Patience-ID"
            onChange={(e) => props.setPatienceID(e.target.value)}
            value={props.patienceID}
          />
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
