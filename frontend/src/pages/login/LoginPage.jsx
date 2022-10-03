import LoginForm from "../../components/login/LoginForm";
import LoginBottom from "../../components/login/LoginBottom";
// import { useHistory } from "react-router-dom";

function LoginPage() {
  // const history = useHistory()

  function loginHandler(loginData) {
    console.log(loginData);
  }

  return (
    <section>
      <h1>Login</h1>
      <LoginForm onLogin={loginHandler} />
      <LoginBottom />
    </section>
  );
}

export default LoginPage;
