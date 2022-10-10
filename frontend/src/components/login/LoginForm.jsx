import classes from "./LoginForm.module.css";
import { useRef } from "react";

function LoginForm(props) {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  function submitHandler(event) {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    const loginData = {
      email: enteredEmail,
      password: enteredPassword,
    };
    props.onLogin(loginData);
  }

  return (
    <form className={classes.form} onSubmit={submitHandler} noValidate>
      <div className={classes.control}>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" ref={emailInputRef} />
      </div>
      <div className={classes.control}>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" ref={passwordInputRef} />
      </div>

      <div className={classes.actions}>
        <button>Login</button>
      </div>
    </form>
  );
}

export default LoginForm;
