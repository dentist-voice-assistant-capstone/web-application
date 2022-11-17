import TopInformationBar from "../../components/record/TopInformationBar";
import classes from "./RecordPage.module.css";
// import NavBar from "../../components/ui/NavBar";
import { useNavigate, useLocation } from "react-router-dom";
// import { startAPIHandler } from "../../utils/apiHandler";
import RecordControlBar from "../../components/record/RecordControlBar";
// import DropdownSm from "../../components/record/information/type/DropdownSm";
// import DropdownLg from "../../components/record/information/type/DropdownLg";
// import DropdownSmBox from "../../components/record/information/type/DropdownSmBox";
// import CheckboxBox from "../../components/record/information/type/CheckboxBox";
// import RecordBuccalInformation from "../../components/record/information/RecordBuccalInformation";
// import RecordLingualInformation from "../../components/record/information/RecordLingualInformation";
import RecordSection from "../../components/record/information/RecordSection";

const RecordPage = () => {
  return (
    <>
      <RecordSection />
    </>
  );
};

export default RecordPage;
