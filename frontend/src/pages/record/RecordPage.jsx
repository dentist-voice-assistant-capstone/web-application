import TopInformationBar from "../../components/record/TopInformationBar";
import { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import classes from "./RecordPage.module.css";
import { EX_DATA } from "../../utils/constants";
// import NavBar from "../../components/ui/NavBar";
import { useNavigate, useLocation } from "react-router-dom";
// import { startAPIHandler } from "../../utils/apiHandler";
import RecordControlBar from "../../components/record/RecordControlBar";

import RecordInformation from "../../components/record/RecordInformation";

const RecordPage = () => {
  const [quadrant, setQuadrant] = useState(1);
  const handleSelect = (e) => {
    setQuadrant(parseInt(e));
  };
  console.log(EX_DATA);
  const [information, setInformation] = useState(EX_DATA);

  // const handleSetInformation = (q, i, side, mode, target, spec_id = NaN) => {
  //   const newInformation = information.map((obj) => {
  //     if (obj.quadrant === q && obj.side === side) {
  //       obj.idxArray.map((data) => {
  //         const newData = data;
  //         if (data.ID === i) {
  //           if (mode === "PD") {
  //             newData.PD[spec_id] = target;
  //             return newData;
  //           } else if (mode === "RE") {
  //             newData.RE[spec_id] = target;
  //             return newData;
  //           } else if (mode === "BOP") {
  //             newData.BOP[spec_id] = target;
  //             return newData;
  //           } else if (mode === "MO") {
  //             newData.MO = target;
  //           } else if (mode === "MGJ") {
  //             newData.MGJ = target;
  //           }
  //         }
  //         return data;
  //       });
  //     }
  //     return obj;
  //   });

  //   setInformation(newInformation);
  // };

  return (
    <div className="landing-page">
      <TopInformationBar />
      <div className={classes.a}>
        <DropdownButton
          className={classes.box}
          title={quadrant}
          onSelect={handleSelect}
        >
          <Dropdown.Item eventKey="1">1</Dropdown.Item>
          <Dropdown.Item eventKey="2">2</Dropdown.Item>
          <Dropdown.Item eventKey="3">3</Dropdown.Item>
          <Dropdown.Item eventKey="4">4</Dropdown.Item>
        </DropdownButton>
      </div>
      <div className="centered">
        {quadrant === 1 && <RecordInformation quadrant={information[0]} />}
        {quadrant === 2 && <RecordInformation quadrant={information[2]} />}
        {quadrant === 3 && <RecordInformation quadrant={information[4]} />}
        {quadrant === 4 && <RecordInformation quadrant={information[6]} />}
      </div>
      <RecordControlBar />
    </div>
  );
};

export default RecordPage;
