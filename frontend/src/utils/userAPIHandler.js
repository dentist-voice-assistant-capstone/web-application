import axios from "axios";
import { URL_BACKEND } from "./constants";

const USER_REGISTER_ENDPOINT = `${URL_BACKEND}/user/signup`;
const USER_LOGIN_ENDPOINT = `${URL_BACKEND}/user/login`;
const USER_EMAIL_CONFIRMATION_ENDPOINT = `${URL_BACKEND}/user/sendEmailConfirm`;
const USER_INFO_ENDPOINT = `${URL_BACKEND}/user/userInfo`;
const USER_UPDATE_PROFILE_ENDPOINT = `${URL_BACKEND}/user/updateProfile`;
const USER_UPDATE_PASSWORD_ENDPOINT = `${URL_BACKEND}/user/updatePassword`;
const USER_SEND_REPORT_EXCEL_ENDPOINT = `${URL_BACKEND}/user/sendReportExcel`;
const USER_ACTIVATE_EMAIL_ENDPOINT = `${URL_BACKEND}/user/activateAccount/`;
const USER_CHECK_TOKEN_ENDPOINT = `${URL_BACKEND}/user/checkToken`;

const userRegisterAPIHandler = (
  userRegisterData,
  setReigsterError,
  setIsEmailDuplicated,
  navigate
) => {
  axios
    .post(USER_REGISTER_ENDPOINT, userRegisterData)
    .then((result) => {
      // register completed
      if (result.status === 201) {
        userEmailConfirmationAPIHandler({ email: userRegisterData.email });
        navigate("/register/email_confirmation", {
          state: { email: userRegisterData.email },
        });
      }
    })
    .catch((error) => {
      // cannot connect to backend server
      if (!error.response) {
        setReigsterError({
          header: "Connection Error",
          content: <p>Cannot connect to backend server.</p>,
        });
        return false;
      }

      // the email is already been used
      if (
        error.response.status === 400 &&
        error.response.data.message.startsWith(
          'Duplicate field value: {"email":'
        )
      ) {
        setReigsterError({
          header: "Cannot Register: Duplicated Email",
          content: (
            <p>
              <b>{userRegisterData.email}</b> has already been used. Please try
              again using another email.
            </p>
          ),
        });
        setIsEmailDuplicated(true);
      } else if (error.response.status === 500) {
        // some unknown errors
        setReigsterError({
          header: "Something Wrong!",
          content: <p>Something went wrong! Please try again later</p>,
        });
      }
      return false;
    });
};

const userEmailConfirmationAPIHandler = (userEmail) => {
  axios.post(USER_EMAIL_CONFIRMATION_ENDPOINT, userEmail);
};

const emailActivatedHandler = (id) => {
  axios.patch(`${USER_ACTIVATE_EMAIL_ENDPOINT}${id}`);
};

const sendReportExcelAPIHandler = (data, email, file_name) => {
  axios
    .post(USER_SEND_REPORT_EXCEL_ENDPOINT, {
      data: data,
      email: email,
      file_name: file_name,
    })
    .then((result) => {
      // console.log(result);
    })
    .catch((error) => {
      // console.log(error);
    });
};
const userLoginAPIHandler = (
  userLoginData,
  setLoginError,
  authCtx,
  session_time,
  navigate
) => {
  axios
    .post(USER_LOGIN_ENDPOINT, userLoginData)
    .then((result) => {
      // console.log(result);
      if (result.status === 200) {
        const expirationTime = new Date(new Date().getTime() + session_time);
        authCtx.login(result.data.token, expirationTime.toISOString());
        navigate("/", {
          state: { email: userLoginData.email },
        });
      }
    })
    .catch((error) => {
      // console.log(error);
      if (!error.response) {
        setLoginError({
          header: "Connection Error",
          content: <p>Cannot connect to backend server.</p>,
        });
        return false;
      }
      setLoginError({
        header: "Cannot Login",
        content: <p>Invalid email or password.</p>,
      });
      return false;
    });
};

const fetchUserInfoAPIHandler = async (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  try {
    const result = await axios.get(USER_INFO_ENDPOINT, config);
    if (result.status === 200) {
      let userDataFetched = result.data.data.user;
      let userDataReturned = {
        email: userDataFetched.email,
        // dentistName, dentistSurname, dentistID may be null
        dentistName: userDataFetched.dentistName || "",
        dentistSurname: userDataFetched.dentistSurname || "",
        dentistID: userDataFetched.dentistID || "",
      };
      return userDataReturned;
    }
  } catch (err) {
    if (!err.response) {
      // ERROR: Cannot connect to backend server
      throw new Error("Cannot connect to backend server");
    } else if (err.response.data.error.name === 'JsonWebTokenError') {
      // ERROR: JWT Token is invalid
      throw new Error("JsonWebTokenError");
    } else if (err.response.data.message === 'The user belonging to this token does no longer exist.') {
      // ERROR: The user belonging to this token does no longer exist
      throw new Error("The user belonging to this token does no longer exist.")
    }
    // other error
    console.log(err)
    return null;
  }
};

const updateUserProfileAPIHandler = (
  token,
  userProfileUpdateData,
  setUserData,
  setUpdateError
) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  axios
    .patch(USER_UPDATE_PROFILE_ENDPOINT, userProfileUpdateData, config)
    .then((result) => {
      let userInfoData = result.data.data.user;
      setUserData({
        email: userInfoData.email,
        dentistName: userInfoData.dentistName || "",
        dentistSurname: userInfoData.dentistSurname || "",
        dentistID: userInfoData.dentistID || "",
      });
    })
    .catch((error) => {
      if (!error.response) {
        setUpdateError({
          header: "Connection Error",
          content: <p>Cannot connect to backend server.</p>,
        });
        return false;
      }
      if (error.response.status === 500) {
        // some unknown errors
        setUpdateError({
          header: "Something Wrong!",
          content: <p>Something went wrong! Please try again later</p>,
        });
      }
    });
};

const updateUserPasswordAPIHandler = (
  token,
  userPasswordUpdateData,
  setUpdateError,
  setUpdateInfo
) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  axios
    .patch(USER_UPDATE_PASSWORD_ENDPOINT, userPasswordUpdateData, config)
    .then((result) => {
      // console.log(result);
      // change password completed
      if (result.status === 200) {
        // TODO: show InfoModal to let the user re-login again, logout the user, navigate to login page
        setUpdateInfo({
          header: "Re-Login needed",
          content: (
            <p>
              Your password has been successfully changed. Re-login is needed.
              The system will redirect you to the login page.
            </p>
          ),
        });
      }
    })
    .catch((error) => {
      if (!error.response) {
        setUpdateError({
          header: "Connection Error",
          content: <p>Cannot connect to backend server.</p>,
        });
        return false;
      }

      // if the entered old password is not correct
      if (error.response.status === 401) {
        setUpdateError({
          header: "Wrong old Password",
          content: (
            <p>
              You have entered incorrect old password. Please recheck and try
              again.
            </p>
          ),
        });
      } else if (error.response.status === 500) {
        // some unknown errors
        setUpdateError({
          header: "Something Wrong!",
          content: <p>Something went wrong! Please try again later</p>,
        });
      }
    });
};

const checkUserTokenAPIHandler = async (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  try {
    const result = await axios.get(USER_CHECK_TOKEN_ENDPOINT, config);
    if (result.status === 200) {
      return result.data.user_id;
    }
  } catch (err) {
    const response = err.response;
    // console.log(response.status, response.statusText)
    return null;
  }
};

export {
  userRegisterAPIHandler,
  userEmailConfirmationAPIHandler,
  userLoginAPIHandler,
  fetchUserInfoAPIHandler,
  updateUserProfileAPIHandler,
  updateUserPasswordAPIHandler,
  sendReportExcelAPIHandler,
  emailActivatedHandler,
  checkUserTokenAPIHandler,
};
