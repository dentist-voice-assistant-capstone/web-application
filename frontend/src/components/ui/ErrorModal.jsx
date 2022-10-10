import { Fragment } from "react";

import classes from "./ErrorModal.module.css";

const ErrorModal = (props) => {
  return (
    <Fragment>
      <div className={classes["backdrop"]} onClick={props.onOKClick}></div>
      <div className={`${classes["error-modal"]}`}>
        <header className={classes["error-modal__header"]}>
          <p>{props.header}</p>
        </header>

        <div className={classes["error-modal__content"]}>{props.content}</div>

        <footer className={classes["error-modal__actions"]}>
          <button onClick={props.onOKClick}>OK</button>
        </footer>
      </div>
    </Fragment>
  );
};

export default ErrorModal;
