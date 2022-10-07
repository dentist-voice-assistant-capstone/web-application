import { Fragment } from "react";

import classes from "./ErrorModal.module.css";

const ErrorModal = (props) => {
  return (
    <Fragment>
      <div className={classes["backdrop"]}></div>
      <div className={`${classes["error-modal"]}`}>
        <header className={classes["error-modal__header"]}>
          <p>{props.header}</p>
        </header>

        <div className={classes["error-modal__content"]}>
          <p>{props.content}</p>
        </div>

        <footer className={classes["error-modal__actions"]}>
          <button>OK</button>
        </footer>
      </div>
    </Fragment>
  );
};

export default ErrorModal;
