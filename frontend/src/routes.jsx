import HomePage from "./pages/home/HomePage";
import RegisterPage from "./pages/register/RegisterPage";
import LoginPage from "./pages/login/LoginPage";
import EmailConfirmPage from "./pages/register/EmailConfirmPage";
import VerificationPage from "./pages/register/VerificationPage";
import AccountEditPage from "./pages/account/AccountEditPage";
import AudioStreamingPage from "./pages/audioStreaming/AudioStreamingPage";
import RecordPage from "./pages/record/RecordPage";
import SummaryPage from "./pages/record/SummaryPage";

export const ROUTES = [
  { path: "/", element: <HomePage /> },
  { path: "*", element: <HomePage /> },
  { path: "/account/edit", element: <AccountEditPage /> },
  { path: "/streaming", element: <AudioStreamingPage /> },
  { path: "/summary", element: <SummaryPage /> }, //maybe delete later
  { path: "/record", element: <RecordPage /> },
];

export const ROUTES_NOT_LOGIN = [
  { path: "/", element: <HomePage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/register/email_confirmation", element: <EmailConfirmPage /> },
  { path: "/register/verification/:id", element: <VerificationPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "*", element: <LoginPage /> },
  { path: "/streaming", element: <AudioStreamingPage /> },
  { path: "/record", element: <RecordPage /> }, //maybe delete later
  { path: "/summary", element: <SummaryPage /> }, //maybe delete later
];

export default ROUTES;
