import { Link } from "react-router-dom";
import classes from './LoginBottom.module.css'

function LoginBottom() {
  return (
    <p className={classes.text}>
      Do not have an account? <Link to="/register">REGISTER HERE</Link>
    </p>
  );
}

export default LoginBottom;
