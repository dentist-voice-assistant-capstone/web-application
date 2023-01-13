import { Fragment } from "react";

import classes from "./ModalConfirm.module.css";

const ModalConfirm = (props) => {
  return (
    <Fragment>
      <div className={classes["backdrop"]}></div>
      <div className={classes["modal"]}>
        <header className={classes["modal__header"]}>
          <p>{props.header}</p>
        </header>

        <div className={classes["modal__content"]}>{props.content}</div>

        <footer className={classes["modal__actions"]}>
          <button
            onClick={props.onCancelClick}
            className={classes["cancel_button"]}
          >
            Cancel
          </button>
          <button onClick={props.onOKClick}>Save</button>
        </footer>
      </div>
    </Fragment>
  );
};

export default ModalConfirm;
