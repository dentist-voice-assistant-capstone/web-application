import { Fragment } from "react";

import classes from "./Modal.module.css";

const Modal = (props) => {
  /* modalType
   * 1. "error" (default)
   * 2. "info"
   * 3. "confirm"
   */

  const modalType = props.modalType || "error";

  const isErrorOrInfoModal = modalType === "error" || modalType === "info";
  const isConfirmModal = modalType === "confirm";

  // buttons in modal actions
  const okButton = (
    <button onClick={props.onOKClick} className={classes["ok_button"]}>
      {props.okButtonText || "OK"}
    </button>
  );
  const cancelButton = (
    <button onClick={props.onCancelClick} className={classes["cancel_button"]}>
      {props.cancelButtonText || "Cancel"}
    </button>
  );

  return (
    <Fragment>
      {/* backdrop */}
      {isErrorOrInfoModal && (
        <div className={classes["backdrop"]} onClick={props.onOKClick}></div>
      )}
      {isConfirmModal && <div className={classes["backdrop"]}></div>}

      <div className={`${classes["modal"]} ${classes[modalType]}`}>
        {/* modal's header */}
        <header className={classes["modal__header"]}>
          <p>{props.header}</p>
        </header>

        {/* modal's content */}
        <div className={classes["modal__content"]}>{props.content}</div>

        {/* modal's action bar */}
        <footer className={classes["modal__actions"]}>
          {isConfirmModal && cancelButton}
          {okButton}
        </footer>
      </div>
    </Fragment>
  );
};

export default Modal;
