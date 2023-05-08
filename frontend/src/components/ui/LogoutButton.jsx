import classes from "./LogoutButton.module.css";
import { useContext } from "react";
import AuthContext from "../../store/auth-context";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const logoutHandler = () => {
    authCtx.logout();
    navigate("/login");
  };

  return (
    <div className={classes.actions}>
      <button onClick={logoutHandler}> Logout </button>
    </div>
  );
}

export default LogoutButton;
