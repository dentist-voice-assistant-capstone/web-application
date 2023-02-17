import classes from "./SummaryPage.module.css";
/* import React Libraries */
import { useState, useEffect, useReducer, Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/* import React Components */
import TopInformationBar from "../../components/record/TopInformationBar";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import RecordControlSummaryBar from "../../components/record/RecordControlSummaryBar";
import RecordControlBar from "../../components/record/RecordControlBar";
import RecordInformation from "../../components/record/RecordInformation";
import Spinner from "react-bootstrap/Spinner";
import { FiCloudOff } from "react-icons/fi";
import Modal from "../../components/ui/Modal";
import CurrentCommandBox from "../../components/record/CurrentCommandBox";
import { EX_DATA } from "../../utils/constants";
import { createReport } from "../../utils/createExcel";
import { sendReportExcelAPIHandler } from "../../utils/apiHandler";

const SummaryPage = () => {
  const state = useLocation();
  console.log(state);
  const userData = state.state.userData;

  const [information, setInformation] = useState(state.state.information);
  const [checkMailExport, setCheckMailExport] = useState(false);
  // const [isMailExport, setIsMailExport] = useState(true);

  /* states for quadrant */
  const [quadrant, setQuadrant] = useState(1);
  const handleSelect = (e) => {
    setQuadrant(parseInt(e));
  };

  const checkMailExportHandler = () => {
    /* if click "MailExport" button, if the recording is not paused, pause the recording */
    setCheckMailExport((prevcheckMailExport) => {
      return !prevcheckMailExport;
    });
  };

  const sendEmailHandler = () => {
    sendReportExcelAPIHandler(information, userData.email);
    checkMailExportHandler();
  };

  const handleSetInformation = (q, i, side, mode, target, spec_id = NaN) => {
    const newInformation = information.map((obj) => {
      if (obj.quadrant === q) {
        obj.idxArray.map((data) => {
          if (data.ID === i) {
            if (mode === "PD") {
              const newPD = data.depended_side_data.map((checkSide) => {
                if (checkSide.side === side) {
                  checkSide.PD[spec_id] = target;
                }
                return checkSide;
              });

              return newPD;
            } else if (mode === "RE") {
              const newRE = data.depended_side_data.map((checkSide) => {
                if (checkSide.side === side) {
                  checkSide.RE[spec_id] = target;
                }
                return checkSide;
              });

              return newRE;
            } else if (mode === "BOP") {
              const newBOP = data.depended_side_data.map((checkSide) => {
                if (checkSide.side === side) {
                  checkSide.BOP[spec_id] = target;
                }
                return checkSide;
              });

              return newBOP;
            } else if (mode === "MO") {
              data.MO = target;
              return data;
            } else if (mode === "MGJ") {
              data.MGJ = target;
              return data;
            } else if (mode === "Missing") {
              data.missing = target;
              return data;
            }
          }
          return data;
        });
      }
      return obj;
    });
    // console.log(newInformation);

    setInformation(newInformation);
  };

  const modalConfirmContent = (
    <p>
      report will send to {userData.email}
      {/* <br />
      Once export,{" "} */}
      {/* <span style={{ color: "red" }}>
        <b> this procedure cannot be reversed.</b>
      </span> */}
    </p>
  );

  /* components to be rendered */
  const PDRETableComponentToBeRendered = (
    <Fragment>
      {checkMailExport && (
        <Modal
          header="Exporting report"
          content={modalConfirmContent}
          onExportClick={sendEmailHandler}
          onCancelClick={checkMailExportHandler}
          exportButtonText="Export"
          modalType="export"
        />
      )}
      <div className="landing-page">
        <TopInformationBar />
        <div className={classes.current_command_box}></div>
        <div className={classes.droplist}>
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
          {quadrant === 1 && (
            <RecordInformation
              information={information[0]}
              currentCommand={false}
              handleSetInformation={handleSetInformation}
            />
          )}
          {quadrant === 2 && (
            <RecordInformation
              information={information[1]}
              currentCommand={false}
              handleSetInformation={handleSetInformation}
            />
          )}
          {quadrant === 3 && (
            <RecordInformation
              information={information[2]}
              currentCommand={false}
              handleSetInformation={handleSetInformation}
            />
          )}
          {quadrant === 4 && (
            <RecordInformation
              information={information[3]}
              currentCommand={false}
              handleSetInformation={handleSetInformation}
            />
          )}
        </div>
        <RecordControlSummaryBar
          createReport={createReport}
          data={information}
          email={userData.email}
          checkMailExportHandler={checkMailExportHandler}
        />
      </div>
    </Fragment>
  );

  return PDRETableComponentToBeRendered;
};

export default SummaryPage;
