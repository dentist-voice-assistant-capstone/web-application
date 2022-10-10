import classes from "./HomePage.module.css"
import LogoutButton from "../../components/ui/LogoutButton";

const HomePage = () => {
  return (
    <div className="landing-page">
      <div className="centered">
        <div className={classes.label}>Home Page</div>
        <LogoutButton />
        </div>
      </div>
  );
};

export default HomePage;
