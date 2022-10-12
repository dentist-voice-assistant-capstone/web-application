import { Fragment, useState } from "react";
import AccountEditForm from "../../components/account/AccountEditForm";
import classes from "./AccountEditPage.module.css";

const AccountEditPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [idxMenuSelected, setIdxMenuSelected] = useState(0);

  const sideBarMenuLabels = ["Account", "Change Password"];

  const changeMenuHandler = (event) => {
    setIdxMenuSelected(event.target.getAttribute("idx"));
    // always disable editing to false when user change the menu
    setIsEditing(false);
  };

  const editClickHandler = () => {
    setIsEditing(true);
  };

  const saveClickHandler = () => {
    setIsEditing(false);
    // TODO: POST Api request
  };

  return (
    <Fragment>
      <div className={classes["account-edit__background"]}></div>
      {/* navbar will be here */}
      <div className={`${classes["account-edit__main"]} centered`}>
        <div className={classes["account-edit__sidebar"]}>
          <h2>User Profile</h2>
          {sideBarMenuLabels.map((sidebarMenuLabel, idx) => (
            <div
              className={`${classes["account-edit__sidebar-menu"]} ${
                idx == idxMenuSelected ? classes["selected"] : ""
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
          <AccountEditForm
            isEditing={isEditing}
            menuSelected={sideBarMenuLabels[idxMenuSelected]}
            onEditClick={editClickHandler}
            onSaveClick={saveClickHandler}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default AccountEditPage;
