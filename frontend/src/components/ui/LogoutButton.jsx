import classes from './LoginBottom.module.css'

function LoginBottom(props) {
  // function logoutHandler(event) {
  //   event.preventDefault();
  // }
  
  return (<div className={classes.actions}>
    <button> Logout </button>
    </div>
  );
}

export default LoginBottom;