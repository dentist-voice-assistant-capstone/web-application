import { Fragment, useState, useContext, useEffect } from "react";

import AccountEditForm from "../../components/account/AccountEditForm";
import PasswordEditForm from "../../components/account/PasswordEditForm";
import Modal from "../../components/ui/Modal";
import NavBar from "../../components/ui/NavBar";
import AuthContext from "../../store/auth-context";
import {
  fetchUserInfoAPIHandler,
  updateUserProfileAPIHandler,
  updateUserPasswordAPIHandler,
} from "../../utils/apiHandler";

import classes from "./AccountEditPage.module.css";

const AccountEditPage = () => {
  // states for editing, sidebar menu selection
  const [isEditing, setIsEditing] = useState(false);
  const [idxMenuSelected, setIdxMenuSelected] = useState(0);

  // states for handling initial fetching user's data
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const [userData, setUserData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // states for toggling modals
  const [updateError, setUpdateError] = useState(null);
  const [updateInfo, setUpdateInfo] = useState(null);

  const sideBarMenuLabels = ["Account", "Change Password"];

  // fetching user data, when loaded page =========================
  useEffect(() => {
    fetchUserInfoAPIHandler(token, setUserData, setIsLoaded, setUpdateError);
  }, [token]);
  // =============================================================

  const changeMenuHandler = (event) => {
    setIdxMenuSelected(parseInt(event.target.getAttribute("idx")));
    // always disable editing to false when user change the menu
    setIsEditing(false);
  };

  const editClickHandler = () => {
    setIsEditing(true);
  };

  const cancelClickHandler = () => {
    setIsEditing(false);
  };

  const profileUpdateHandler = (userProfileUpdateData) => {
    setIsEditing(false);
    updateUserProfileAPIHandler(
      token,
      userProfileUpdateData,
      setUserData,
      setUpdateError
    );
  };

  const updatePasswordHandler = (userPasswordUpdateData) => {
    updateUserPasswordAPIHandler(
      token,
      userPasswordUpdateData,
      setUpdateError,
      setUpdateInfo
    );
  };

  const errorModalOkHandler = () => {
    // clear update error after click "OK" button or backdrop in ErrorModal
    setUpdateError();
  };

  const infoModalOkHandler = () => {
    setUpdateInfo();
    authCtx.logout();
  };

  // select appropriate form to be displayed, depends on selected menu (default: Account)
  let formToBeDisplayed;
  if (sideBarMenuLabels[idxMenuSelected] === "Account") {
    formToBeDisplayed = (
      <AccountEditForm
        isEditing={isEditing}
        userDefaultData={userData}
        onEditClick={editClickHandler}
        onCancelClick={cancelClickHandler}
        onSaveClick={profileUpdateHandler}
      />
    );
  } else if (sideBarMenuLabels[idxMenuSelected] === "Change Password") {
    formToBeDisplayed = (
      <PasswordEditForm onSaveClick={updatePasswordHandler} />
    );
  }
  return (
    <Fragment>
      <div className={classes["image-section"]}>
        <div className={classes["account-edit__background"]}></div>
        <NavBar
          isLoaded={isLoaded}
          email="email"
          userData={userData}
          setUserData={setUserData}
        ></NavBar>
        {/* Error Modal */}
        {updateError && (
          <Modal
            header={updateError.header}
            content={updateError.content}
            onOKClick={errorModalOkHandler}
            modalType="error"
          />
        )}
        {/* Info Modal */}
        {updateInfo && (
          <Modal
            header={updateInfo.header}
            content={updateInfo.content}
            onOKClick={infoModalOkHandler}
            modalType="info"
          />
        )}
        <div className={classes["main"]}>
          <div className={`${classes["account-edit__main"]}`}>
            <div className={classes["account-edit__sidebar"]}>
              <h2>User Profile</h2>
              {sideBarMenuLabels.map((sidebarMenuLabel, idx) => (
                <div
                  className={`${classes["account-edit__sidebar-menu"]} ${
                    idx === idxMenuSelected ? classes["selected"] : ""
                  }`}
                  key={sidebarMenuLabel}
                  idx={idx}
                  onClick={changeMenuHandler}
                >
                  {sidebarMenuLabel}
                </div>
              ))}
            </div>
            <div className={classes["account-edit__form-area"]}>
              {/* only render form, when the user's data is loaded */}
              {isLoaded && formToBeDisplayed}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default AccountEditPage;
