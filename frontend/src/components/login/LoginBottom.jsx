import classes from './LoginBottom.module.css'

function LoginBottom() {
  return (
    <div className={classes.text}>
      Do not have an account? <a href="/register">REGISTER HERE</a>
    </div>
  );
}

export default LoginBottom;
