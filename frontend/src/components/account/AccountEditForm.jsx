import classes from "./AccountEditForm.module.css";

const AccountEditForm = (props) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    props.onSaveClick();
    console.log("handleSubmit detected!");
  };

  const inputElements = [
    {
      label: "Email",
      type: "text",
      menu: "Account",
      isChangeAble: false,
      value: "test@hotmail.com",
    },
    { label: "Name", menu: "Account", isChangeAble: true, value: "Name Test" },
    {
      label: "Surname",
      type: "text",
      menu: "Account",
      isChangeAble: true,
      value: "Surname Test",
    },
    {
      label: "Dentist ID",
      type: "text",
      menu: "Account",
      isChangeAble: true,
      value: "000001",
    },
    {
      label: "Old Password",
      type: "password",
      menu: "Change Password",
      isChangeAble: true,
      value: null,
    },
    {
      label: "New Password",
      type: "password",
      menu: "Change Password",
      isChangeAble: true,
      value: null,
    },
    {
      label: "Confirm New Password",
      type: "password",
      menu: "Change Password",
      isChangeAble: true,
      value: null,
    },
  ];

  const filteredInputElements = inputElements.filter(
    (inputElement) => inputElement.menu === props.menuSelected
  );

  return (
    <form onSubmit={handleSubmit}>
      {/* Inputs */}
      {filteredInputElements.map((inputElement) => (
        <div
          className={classes["account-edit__form-items"]}
          key={inputElement.label}
        >
          <label>{inputElement.label}</label>
          <br />
          {!inputElement.isChangeAble ? (
            <p>{inputElement.value}</p>
          ) : (
            <input
              disabled={
                inputElement.menu !== "Change Password" && !props.isEditing
              }
              placeholder={inputElement.value}
              type={inputElement.type}
            ></input>
          )}
        </div>
      ))}

      {/* Actions */}
      <div className={classes["account-edit__from-actions"]}>
        {/* Edit button */}
        {props.menuSelected !== "Change Password" && !props.isEditing && (
          <button
            type="button"
            className={classes["edit"]}
            onClick={props.onEditClick}
          >
            Edit
          </button>
        )}
        {/* Save Change button -> submit button */}
        <button
          type="submit"
          className={classes["save"]}
          hidden={!props.isEditing && props.menuSelected !== "Change Password"}
        >
          Save Change
        </button>
      </div>
    </form>
  );
};

export default AccountEditForm;
