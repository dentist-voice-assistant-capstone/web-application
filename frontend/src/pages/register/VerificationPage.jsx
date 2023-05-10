import { useLocation, useParams } from "react-router-dom";
import "./VerificationPage.css";
import { emailActivatedHandler } from "../../utils/userAPIHandler";

const VerificationPage = () => {
  const { id } = useParams();
  // console.log(id);
  emailActivatedHandler(id);
  return (
    <div className="landing-page">
      <div className="verification centered">
        <div className="verification__label">Your email has been verified</div>
        <div className="verification__detail">
          Thank you for verifying your email address.
        </div>
        <div className="verification__login">
          Go back to <a href="/login">LOGIN HERE</a>
        </div>
      </div>
    </div>
    // <div>
    //   <h3>Click the button below to activate your email address</h3>
    //   <a href={`/register/verification/${id}`}>
    //     <button
    //       style={{
    //         background: "green",
    //         color: "white",
    //         height: "36px",
    //         width: "180px",
    //         border: "2px solid rgba(0, 0, 0, 0.05)",
    //       }}
    //     >
    //       Verify My Email
    //     </button>
    //   </a>
    // </div>
  );
};

export default VerificationPage;
