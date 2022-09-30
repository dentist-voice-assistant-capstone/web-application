import HomePage from "./pages/home/HomePage";
import RegisterPage from "./pages/register/RegisterPage";
import LoginPage from "./pages/login/LoginPage";
import EmailConfirmPage from "./pages/register/EmailConfirmPage";

const ROUTES = [
  { path: "/", element: <HomePage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/register/email_confirmation", element: <EmailConfirmPage /> },
  { path: "/login", element: <LoginPage /> },
];

export default ROUTES;
