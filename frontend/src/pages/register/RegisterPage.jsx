import RegisterForm from "../../components/register/RegisterForm";
import "./RegisterPage.css";

const RegisterPage = () => {
  return (
    <div className="landing-page">
      <div className="register centered">
        <div className="register__label">Register</div>
        <RegisterForm />
        <div className="register__login">
          Already have an account? <a href="/login">LOGIN HERE</a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
