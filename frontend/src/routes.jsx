import HomePage from "./pages/home/HomePage";
import RegisterPage from "./pages/register/RegisterPage";
import LoginPage from "./pages/login/LoginPage";
import EmailConfirmPage from "./pages/register/EmailConfirmPage";
import AccountEditPage from "./pages/account/AccountEditPage";

export const ROUTES = [
  { path: "/", element: <HomePage /> },
  { path: "*", element: <HomePage /> },
  { path: "/account/edit", element: <AccountEditPage /> },
];

export const ROUTES_NOT_LOGIN = [
  { path: "/register", element: <RegisterPage /> },
  { path: "/register/email_confirmation", element: <EmailConfirmPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "*", element: <LoginPage /> },
];

export default ROUTES;
