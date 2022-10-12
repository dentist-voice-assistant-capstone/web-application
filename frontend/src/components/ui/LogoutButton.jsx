import classes from './LogoutButton.module.css'
import { useContext } from 'react'
import AuthContext from '../../store/auth-context';

function LogoutButton() {

    const authCtx = useContext(AuthContext);
    const logoutHandler = () => {
      authCtx.logout()
    }


  return (
    <div className={classes.actions}>
      <button onClick={logoutHandler}> Logout </button>
    </div>
  );
}

export default LogoutButton;
