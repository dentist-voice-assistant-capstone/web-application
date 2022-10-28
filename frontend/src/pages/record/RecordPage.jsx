import TopInformationBar from "../../components/record/TopInformationBar";
// import classes from "./HomePage.module.css";
// import NavBar from "../../components/ui/NavBar";
import { useNavigate, useLocation } from "react-router-dom";
// import { startAPIHandler } from "../../utils/apiHandler";
import RecordControlBar from "../../components/record/RecordControlBar";

const RecordPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <TopInformationBar dentistID={"dentistID"}></TopInformationBar>
      <RecordControlBar />
    </div>
  );
};

export default RecordPage;
