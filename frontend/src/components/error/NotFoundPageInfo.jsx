import classes from "./NotFoundPageInfo.module.css";
import { useNavigate } from "react-router-dom";

function NotFoundPageInfo() {
  const navigate = useNavigate();
  return (
    <div>
      <div className={classes.header}>Oops! Page Not Found!</div>
      <div className={classes.detail}>
        Sorry. It looks like you are trying to access a page that has been
        deleted or never been existed.
      </div>
      <div className={classes.actions}>
        <button
          onClick={() => {
            navigate("/");
          }}
        >
          Back to Home Page
        </button>
      </div>
    </div>
  );
}

export default NotFoundPageInfo;
