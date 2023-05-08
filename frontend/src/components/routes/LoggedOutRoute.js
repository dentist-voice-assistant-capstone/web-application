import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../store/auth-context";

export const LoggedOutRoute = ({ children }) => {
  const authCtx = useContext(AuthContext);
  // If user is not logout (still logged in) and access to the page that must logged out, navigate user to the home page.
  if (authCtx.isLoggedIn) {
    console.log('User is not logged out yet, redirect to the home page.')
    return <Navigate to="/" />;
  }
  return children;
};
