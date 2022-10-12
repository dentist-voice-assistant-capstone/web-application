import { Fragment, useState } from "react";
import classes from "./AccountEditPage.module.css";

const AccountEditPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [idxMenuSelected, setIdxMenuSelected] = useState(0);

  const sideBarMenuLabels = ["Account", "Password"];

  const editClickHandler = () => {
    setIsEditing(true);
  };

  const saveClickHandler = () => {
    setIsEditing(false);
    // POST API request
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
            >
              {sidebarMenuLabel}
            </div>
          ))}
        </div>
        <div className={classes["account-edit__form-area"]}>
          <div className={classes["account-edit__form-items"]}>
            <label>Email</label>
            <br />
            <p>test@hotmail.com</p>
          </div>
          <div className={classes["account-edit__form-items"]}>
            <label>Name</label>
            <br />
            <input placeholder="Name Test" disabled={!isEditing}></input>
          </div>
          <div className={classes["account-edit__form-items"]}>
            <label>Surname</label>
            <br />
            <input placeholder="Surname Test" disabled={!isEditing}></input>
          </div>
          <div className={classes["account-edit__form-items"]}>
            <label>Dentist ID</label>
            <br />
            <input placeholder="Dentist ID Rest" disabled={!isEditing}></input>
          </div>
          <div className={classes["account-edit__from-actions"]}>
            {!isEditing ? (
              <button className={classes["edit"]} onClick={editClickHandler}>
                Edit
              </button>
            ) : (
              <button className={classes["save"]} onClick={saveClickHandler}>
                Save Change
              </button>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default AccountEditPage;
