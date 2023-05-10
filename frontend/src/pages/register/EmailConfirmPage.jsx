import { Link, useLocation } from "react-router-dom";
import "./EmailConfirmPage.css";
import { userEmailConfirmationAPIHandler } from "../../utils/userAPIHandler";
import parse from "html-react-parser";

const EmailConfirmPage = () => {
  const { state } = useLocation();
  const { email } = state;

  function resendHandler() {
    userEmailConfirmationAPIHandler({
      email: email,
    });
  }

  return (
    <div className="landing-page">
      <div className="email_confirmation centered">
        <div className="email_confirmation__label">Email Confirmation</div>
        <div className="email_confirmation__detail">
          To verify that your email address is valid, we've sent email to{" "}
          <b>{email}</b>.
          <br /> Once you receive the email, click the provided link to complete
          registering.
        </div>
        <div className="email_confirmation__resend">
          If you still don't see it, you can{" "}
          <a href="/register/email_confirmation" onClick={resendHandler}>
            RESEND THE CONFIRMATION EMAIL
          </a>
        </div>
        <div className="email_confirmation__login">
          Already confirm your email? <a href="/login">LOGIN HERE</a>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmPage;
