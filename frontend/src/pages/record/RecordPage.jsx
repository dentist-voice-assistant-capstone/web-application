import TopInformationBar from "../../components/record/TopInformationBar";
import { useState } from "react";

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
// import RecordSection from "../../components/record/information/RecordSection";
import RecordInformation from "../../components/record/RecordInformation";

const RecordPage = () => {
  const data = [1, 2, 3, 4, 5, 6, 7, 8];
  const [isChecked, setIsChecked] = useState(false);
  return (
    <div>
      <RecordInformation />
    </div>
  );
};

export default RecordPage;
