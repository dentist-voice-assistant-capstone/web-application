import { useState } from "react";
import "./RegisterForm.css";

const RegisterForm = () => {
  const [inputs, setInputs] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(inputs);
  };

  return (
    <form onSubmit={handleSubmit} className="register-form" noValidate>
      {/* 1) ส่วนกรอกข้อมูล */}
      <div className="register-form__fill_area">
        {/* 1.1) ส่วนกรอกข้อมูล Email and Password */}
        <div className="register-form__sections">
          <div className="register-form__topics">Account Information</div>

          <ul className="register-form__items-list">
            <li className="register-form__items">
              <label>Email</label>
              <div>
                {/* <p className="info">Hello</p> */}
                <input
                  type="email"
                  name="email"
                  value={inputs.email || ""}
                  onChange={handleChange}
                />
                {/* <p className="warning">Cannot be blank</p> */}
              </div>
            </li>

            <li className="register-form__items">
              <label>Password</label>
              <div>
                <input
                  type="password"
                  name="password"
                  value={inputs.password || ""}
                  onChange={handleChange}
                />
              </div>
            </li>
            <li className="register-form__items">
              <label>
                Confirm
                <br />
                Password
              </label>
              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={inputs.confirmPassword || ""}
                  onChange={handleChange}
                />
              </div>
            </li>
          </ul>
        </div>

        {/* 1.2) ส่วนกรอกข้อมูลทั่วไป */}
        <div>
          <div className="register-form__sections">
            <div className="register-form__topics">General Information</div>
            <ul className="register-form__items-list">
              <li className="register-form__items">
                <label>First Name</label>
                <div>
                  <input
                    type="text"
                    name="firstName"
                    value={inputs.firstName || ""}
                    onChange={handleChange}
                  />
                </div>
              </li>

              <li className="register-form__items">
                <label>Last Name</label>
                <div>
                  <input
                    type="text"
                    name="lastName"
                    value={inputs.lastName || ""}
                    onChange={handleChange}
                  />
                </div>
              </li>

              <li className="register-form__items">
                <label>Dentist ID</label>
                <div>
                  <input
                    type="text"
                    name="dentistID"
                    value={inputs.dentistID || ""}
                    onChange={handleChange}
                  />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ส่วน submit button */}
      <div className="register-form__submit-area">
        <button type="submit" className="register-form__register-button">
          Register
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
