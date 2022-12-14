import HomePage from "./pages/home/HomePage";
import RegisterPage from "./pages/register/RegisterPage";
import LoginPage from "./pages/login/LoginPage";
import EmailConfirmPage from "./pages/register/EmailConfirmPage";
import AccountEditPage from "./pages/account/AccountEditPage";
import AudioStreamingPage from "./pages/audioStreaming/AudioStreamingPage";
import RecordPage from "./pages/record/RecordPage";

export const ROUTES = [
  { path: "/", element: <HomePage /> },
  { path: "*", element: <HomePage /> },
  { path: "/account/edit", element: <AccountEditPage /> },
  { path: "/streaming", element: <AudioStreamingPage /> },
  { path: "/record", element: <RecordPage /> },
];

export const ROUTES_NOT_LOGIN = [
  { path: "/register", element: <RegisterPage /> },
  { path: "/register/email_confirmation", element: <EmailConfirmPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "*", element: <LoginPage /> },
  { path: "/streaming", element: <AudioStreamingPage /> },
  { path: "/record", element: <RecordPage /> }, //maybe delete later
];

export default ROUTES;
