import { Fragment } from "react";

import classes from "./Modal.module.css";

const Modal = (props) => {
  const modalType = props.modalType || "error";

  return (
    <Fragment>
      <div className={classes["backdrop"]} onClick={props.onOKClick}></div>
      <div className={`${classes["modal"]} ${classes[modalType]}`}>
        <header className={classes["modal__header"]}>
          <p>{props.header}</p>
        </header>

        <div className={classes["modal__content"]}>{props.content}</div>

        <footer className={classes["modal__actions"]}>
          <button onClick={props.onOKClick}>OK</button>
        </footer>
      </div>
    </Fragment>
  );
};

export default Modal;
