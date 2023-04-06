import classes from "./ErrorPage.module.css";
import { Fragment } from "react";
import NotFoundPageInfo from "../../components/error/NotFoundPageInfo";

const LoginPage = () => {
  return (
    <Fragment>
      <div className="landing-page">
        <div className={classes["image-section"]}>
          <div className="centered">
            <NotFoundPageInfo></NotFoundPageInfo>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default LoginPage;
