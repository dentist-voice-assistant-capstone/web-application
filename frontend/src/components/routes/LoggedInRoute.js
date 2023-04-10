import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../store/auth-context";

export const LoggedInRoute = ({ children }) => {
  const authCtx = useContext(AuthContext);
  // If user is not login and access to the page that must logged in, navigate user to the login page.
  if (!authCtx.isLoggedIn) {
    console.log('User is not logged in yet, redirect to the login page.')
    return <Navigate to="/login" />;
  }
  return children;
};
