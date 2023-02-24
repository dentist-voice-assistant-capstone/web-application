import classes from "./SummaryPage.module.css";
/* import React Libraries */
import { useState, Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Alert from "react-bootstrap/Alert";

/* import React Components */
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import RecordControlSummaryBar from "../../components/record/RecordControlSummaryBar";
import RecordInformation from "../../components/record/RecordInformation";
import InformationBox from "../../components/record/InformationBox";
import NavBar from "../../components/ui/NavBar";

import Modal from "../../components/ui/Modal";
import { createReport } from "../../utils/createExcel";
import { sendReportExcelAPIHandler } from "../../utils/apiHandler";
import { teethInformationHandler } from "../../utils/TeethInformationHandler";

const SummaryPage = () => {
  const navigate = useNavigate();

  const state = useLocation();
  const userData = state.state.userData;

  const patienceID = state.state.patienceID;
  const dentistID = state.state.dentistID;
  const date = state.state.date;

  const file_name = `${patienceID}_${date}`;

  const [information, setInformation] = useState(state.state.information);
  const [checkMailExport, setCheckMailExport] = useState(false);
  const [checkBackToHome, setCheckBackToHome] = useState(false);
  const [showSentSuccess, setShowSentSuccess] = useState(false);

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

  const checkBackToHomeHandler = () => {
    setCheckBackToHome((prevcheckBackToHome) => {
      return !prevcheckBackToHome;
    });
  };

  const showSentSuccessHandler = () => {
    setShowSentSuccess(true);

    setTimeout(() => {
      setShowSentSuccess(false);
    }, 3000);
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

    // const newInformation = information.map((obj) => {
    //   if (obj.quadrant === q) {
    //     obj.idxArray.map((data) => {
    //       if (data.ID === i) {
    //         if (mode === "PD") {
    //           const newPD = data.depended_side_data.map((checkSide) => {
    //             if (checkSide.side === side) {
    //               checkSide.PD[spec_id] = target;
    //             }
    //             return checkSide;
    //           });

    //           return newPD;
    //         } else if (mode === "RE") {
    //           const newRE = data.depended_side_data.map((checkSide) => {
    //             if (checkSide.side === side) {
    //               checkSide.RE[spec_id] = target;
    //             }
    //             return checkSide;
    //           });

    //           return newRE;
    //         } else if (mode === "BOP") {
    //           const newBOP = data.depended_side_data.map((checkSide) => {
    //             if (checkSide.side === side) {
    //               checkSide.BOP[spec_id] = target;
    //             }
    //             return checkSide;
    //           });

    //           return newBOP;
    //         } else if (mode === "MO") {
    //           data.MO = target;
    //           return data;
    //         } else if (mode === "MGJ") {
    //           data.MGJ = target;
    //           return data;
    //         } else if (mode === "Missing") {
    //           data.missing = target;
    //           return data;
    //         }
    //       }
    //       return data;
    //     });
    //   }
    //   return obj;
    // });

    setInformation(newInformation);
  };

  const modalExportContent = (
    <p>
      report will send to {userData.email}
      {/* <br />
      Once export,{" "} */}
      {/* <span style={{ color: "red" }}>
        <b> this procedure cannot be reversed.</b>
      </span> */}
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
              variant="success"
              style={{ height: "56px", border: 0, margin: 0 }}
              // className={classes["success_message"]}
            >
              Report has been sent successfully
            </Alert>
          </div>
        )}
        {/* <TopInformationBar
            date={date}
            patienceID={patienceID}
            dentistID={dentistID}
            isSummary={true}
            checkBackToHomeHandler={checkBackToHomeHandler}
          /> */}
        <div className={classes["top-bar"]}>
          <NavBar
            userData={userData}
            isLoaded={true}
            isSummary={true}
            checkBackToHomeHandler={checkBackToHomeHandler}
          ></NavBar>
        </div>
        <div className={classes.information_box}>
          <InformationBox
            dentistID={dentistID}
            patienceID={patienceID}
            date={date}
          />
        </div>
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
          file_name={file_name}
        />
      </div>
    </Fragment>
  );

  return PDRETableComponentToBeRendered;
};

export default SummaryPage;
