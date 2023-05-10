import classes from "./SummaryPage.module.css";
/* import React Libraries */
import { useState, Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import "bootstrap/dist/css/bootstrap.css";

/* import React Components */
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import RecordControlSummaryBar from "../../components/record/RecordControlSummaryBar";
import RecordInformation from "../../components/record/RecordInformation";
import InformationBox from "../../components/record/InformationBox";
import NavBar from "../../components/ui/NavBar";

import Modal from "../../components/ui/Modal";
import { createReport } from "../../utils/createExcel";
import { sendReportExcelAPIHandler } from "../../utils/userAPIHandler";
import {
  teethInformationHandler,
  // randomValue,
  valueGenarator,
} from "../../utils/TeethInformationHandler";
import { EX_DATA } from "../../utils/constants";

const SummaryPage = () => {
  const navigate = useNavigate();

  const state = useLocation();
  const defaultInformation = JSON.parse(JSON.stringify(EX_DATA));
  const userData = state.state.userData;

  const patientID = state.state.patientID;
  const dentistID = state.state.dentistID;
  const date = state.state.date;

  const file_name = `${patientID}_${date}`;

  const [information, setInformation] = useState(
    Object.assign([], state.state.information)
  );
  const [checkMailExport, setCheckMailExport] = useState(false);
  const [checkBackToHome, setCheckBackToHome] = useState(false);
  const [showSentSuccess, setShowSentSuccess] = useState(false);
  const [value, setValue] = useState(null);

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
  // const valueHandler = () => {
  //   const v = randomValue("MO");
  //   setValue(v);
  //   console.log(v);
  // };
  const checkBackToHomeHandler = () => {
    setCheckBackToHome((prevcheckBackToHome) => {
      return !prevcheckBackToHome;
    });
  };

  const showSentSuccessHandler = () => {
    setShowSentSuccess(true);

    setTimeout(() => {
      setShowSentSuccess(false);
    }, 2000);
  };

  const backToHomePageHandler = () => {
    checkBackToHomeHandler();
    navigate("/");
  };

  const exportConfirmHandler = () => {
    sendReportExcelAPIHandler(information, userData.email, file_name);
    checkMailExportHandler();
    showSentSuccessHandler();
  };

  const handleSetInformation = (q, i, side, mode, target, spec_id = NaN) => {
    const newInformation = information.map((obj) => {
      return teethInformationHandler(obj, q, i, side, mode, target, spec_id);
    });
    setInformation(newInformation);
  };

  const handleUndoToothMissing = (q, i) => {
    handleSetInformation(q, i, null, "Missing", false);
  };

  const handleAddToothMissing = (q, i) => {
    handleSetInformation(q, i, null, "Missing", true);
  };

  const handleRandomInformation = () => {
    const newInformation = information.map((obj) => {
      return valueGenarator(obj);
    });
    setInformation(newInformation);
  };

  const handleResetInformation = () => {
    setInformation(JSON.parse(JSON.stringify(defaultInformation)));
  };

  const modalExportContent = (
    <p>
      The report will be sent to {userData.email}
      <br />
      <span style={{ color: "red" }}>
        <b> Please recheck whether email is correct before export.</b>
      </span>
    </p>
  );

  const modalBackContent = (
    <p>
      Are you sure to go back to Hame Page?
      <br />
      Once confirmed,{" "}
      <span style={{ color: "red" }}>
        <b> this procedure cannot be reversed.</b>
      </span>
    </p>
  );

  /* components to be rendered */
  const PDRETableComponentToBeRendered = (
    <Fragment>
      {checkMailExport && (
        <Modal
          header="Exporting report"
          content={modalExportContent}
          onExportClick={exportConfirmHandler}
          onCancelClick={checkMailExportHandler}
          exportButtonText="Export"
          modalType="export"
        />
      )}
      {checkBackToHome && (
        <Modal
          header="Back to Home Page"
          content={modalBackContent}
          onOKClick={backToHomePageHandler}
          onCancelClick={checkBackToHomeHandler}
          okButtonText="Confirm"
          modalType="confirm"
        />
      )}
      <div className="landing-page">
        {showSentSuccess && (
          <div className={classes["success_message"]}>
            <Alert
              show={showSentSuccess}
              variant="success"
              style={{ height: "5.5vh", border: 0, margin: 0 }}
            >
              Report has been sent successfully
            </Alert>
          </div>
        )}
        <div className={classes["top-bar"]}>
          <NavBar
            userData={userData}
            isLoaded={true}
            isSummary={true}
            checkBackToHomeHandler={checkBackToHomeHandler}
          ></NavBar>
        </div>{" "}
        <div className={classes.droplist}>
          <DropdownButton
            className={classes.box}
            title={`Q${quadrant}`}
            onSelect={handleSelect}
          >
            <Dropdown.Item eventKey="1">Q1</Dropdown.Item>
            <Dropdown.Item eventKey="2">Q2</Dropdown.Item>
            <Dropdown.Item eventKey="3">Q3</Dropdown.Item>
            <Dropdown.Item eventKey="4">Q4</Dropdown.Item>
          </DropdownButton>
        </div>
        <div className={classes["information_area"]}>
          <div className={classes["information_user"]}>
            <div className={classes["information_box"]}>
              <InformationBox
                dentistID={dentistID}
                patientID={patientID}
                date={date}
              />
            </div>
          </div>

          <div className={classes["information_process"]}>
            {quadrant === 1 && (
              <RecordInformation
                information={information[0]}
                currentCommand={false}
                handleSetInformation={handleSetInformation}
                handleUndoToothMissing={handleUndoToothMissing}
                handleAddToothMissing={handleAddToothMissing}
              />
            )}
            {quadrant === 2 && (
              <RecordInformation
                information={information[1]}
                currentCommand={false}
                handleSetInformation={handleSetInformation}
                handleUndoToothMissing={handleUndoToothMissing}
                handleAddToothMissing={handleAddToothMissing}
              />
            )}
            {quadrant === 3 && (
              <RecordInformation
                information={information[2]}
                currentCommand={false}
                handleSetInformation={handleSetInformation}
                handleUndoToothMissing={handleUndoToothMissing}
                handleAddToothMissing={handleAddToothMissing}
              />
            )}
            {quadrant === 4 && (
              <RecordInformation
                information={information[3]}
                currentCommand={false}
                handleSetInformation={handleSetInformation}
                handleUndoToothMissing={handleUndoToothMissing}
                handleAddToothMissing={handleAddToothMissing}
              />
            )}
          </div>
        </div>
        <RecordControlSummaryBar
          createReport={createReport}
          data={information}
          email={userData.email}
          checkMailExportHandler={checkMailExportHandler}
          file_name={file_name}
        />
      </div>
    </Fragment>
  );

  return PDRETableComponentToBeRendered;
};

export default SummaryPage;
