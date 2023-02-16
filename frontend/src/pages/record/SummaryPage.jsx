import classes from "./SummaryPage.module.css";
/* import React Libraries */
import { useState, useEffect, useReducer, Fragment } from "react";
import { useNavigate } from "react-router-dom";

/* import React Components */
import TopInformationBar from "../../components/record/TopInformationBar";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import RecordControlBar from "../../components/record/RecordControlBar";
import RecordInformation from "../../components/record/RecordInformation";
import Spinner from "react-bootstrap/Spinner";
import { FiCloudOff } from "react-icons/fi";
import Modal from "../../components/ui/Modal";
import CurrentCommandBox from "../../components/record/CurrentCommandBox";
import { EX_DATA } from "../../utils/constants";

const SummaryPage = () => {
  const [information, setInformation] = useState(EX_DATA);
  const [checkFinish, setCheckFinish] = useState(false);
  const [isFinish, setIsFinish] = useState(false);

  /* states for quadrant */
  const [quadrant, setQuadrant] = useState(1);
  const handleSelect = (e) => {
    setQuadrant(parseInt(e));
  };

  // const checkFinishHandler = () => {
  //   /* if click "Finish" button, if the recording is not paused, pause the recording */
  //   if (!isPaused) {
  //     pauseResumeHandler();
  //   }
  //   setCheckFinish((prevcheckFinish) => {
  //     return !prevcheckFinish;
  //   });
  // };

  // const summaryHandler = () => {
  //   // console.log(information);
  //   navigate("/summary", {
  //     state: { information: information },
  //   });
  // };

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
      Are you sure to finish the recording?
      <br />
      Once saved,{" "}
      <span style={{ color: "red" }}>
        <b> this procedure cannot be reversed.</b>
      </span>
    </p>
  );

  /* components to be rendered */
  const PDRETableComponentToBeRendered = (
    <Fragment>
      {/* {checkFinish && (
        <Modal
          header="Confirm Information"
          content={modalConfirmContent}
          onOKClick={confirmHandler}
          onCancelClick={checkFinishHandler}
          okButtonText="Save"
          modalType="confirm"
        />
      )} */}
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
        <button
          style={{ margin: "50px 20px 0px 50px" }}
          onClick={() => {
            // dispatchCurrentCommand({
            //   type: "UPDATE_COMMAND",
            //   payload: {
            //     command: "PDRE",
            //     tooth: "15",
            //     side: "lingual",
            //     position: "mesial",
            //   },
            // });
          }}
        >
          Initialize
        </button>
        <button
          style={{ margin: "50px 20px 0px 50px" }}
          onClick={() => {
            // dispatchCurrentCommand({
            //   type: "UPDATE_PDRE_POSITION",
            //   payload: {
            //     tooth: "15",
            //     side: "lingual",
            //     position: "middle",
            //   },
            // });
          }}
        >
          Move
        </button>
        <RecordControlBar
          isFinish={!isFinish}
          // checkFinishHandler={checkFinishHandler}
          // summaryHandler={summaryHandler}
        />
      </div>
    </Fragment>
  );

  return PDRETableComponentToBeRendered;
};

export default SummaryPage;
