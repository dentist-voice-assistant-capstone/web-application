import TopInformationBar from "../../components/record/TopInformationBar";
import classes from "./RecordPage.module.css";
// import NavBar from "../../components/ui/NavBar";
import { useNavigate, useLocation } from "react-router-dom";
// import { startAPIHandler } from "../../utils/apiHandler";
import RecordControlBar from "../../components/record/RecordControlBar";
import DropdownSm from "../../components/record/information/type/DropdownSm";
import DropdownLg from "../../components/record/information/type/DropdownLg";
import DropdownSmBox from "../../components/record/information/type/DropdownSmBox";

const RecordPage = () => {
  const navigate = useNavigate();
  const options = ["one", "two", "three"];
  const defaultOption = options[0];

  return (
    <>
      <DropdownSmBox /> <DropdownLg />
    </>
  );
};

export default RecordPage;
