import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import RegisterPage from "./pages/register/RegisterPage";
import LoginPage from "./pages/login/LoginPage";
import EmailConfirmPage from "./pages/register/EmailConfirmPage";
import VerificationPage from "./pages/register/VerificationPage";
import AccountEditPage from "./pages/account/AccountEditPage";
import AudioStreamingPage from "./pages/audioStreaming/AudioStreamingPage";
import RecordPage from "./pages/record/RecordPage";
import SummaryPage from "./pages/record/SummaryPage";
import ErrorPage from "./pages/error/ErrorPage";
import { LoggedInRoute } from "./components/routes/LoggedInRoute";
import { LoggedOutRoute } from "./components/routes/LoggedOutRoute";
import { SUPPRESS_LOG_PRODUCTION } from "./utils/constants";

function App() {
  // Disable console.log in production environment ==================================================
  if (!!process.env.NODE_ENV && process.env.NODE_ENV === "production" && SUPPRESS_LOG_PRODUCTION) {
    console.log = () => { };
  }
  // ================================================================================================
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/register"
          element={
            <LoggedOutRoute>
              <RegisterPage />
            </LoggedOutRoute>
          }
        />
        <Route
          path="/register/email_confirmation"
          element={
            <LoggedOutRoute>
              <EmailConfirmPage />
            </LoggedOutRoute>
          }
        />
        <Route
          path="/register/verification/:id"
          element={
            <LoggedOutRoute>
              <VerificationPage />
            </LoggedOutRoute>
          }
        />
        <Route
          path="/login"
          element={
            <LoggedOutRoute>
              <LoginPage />
            </LoggedOutRoute>
          }
        />
        <Route
          path="/account/edit"
          element={
            <LoggedInRoute>
              <AccountEditPage />
            </LoggedInRoute>
          }
        />
        <Route
          path="/streaming"
          element={
            <LoggedInRoute>
              <AudioStreamingPage />
            </LoggedInRoute>
          }
        />
        <Route
          path="/record"
          element={
            <LoggedInRoute>
              <RecordPage />
            </LoggedInRoute>
          }
        />
        <Route
          path="/summary"
          element={
            <LoggedInRoute>
              <SummaryPage />
            </LoggedInRoute>
          }
        />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App;
