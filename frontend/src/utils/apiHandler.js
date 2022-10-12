import axios from "axios";

const backendBaseURL = "http://localhost:3000";

const USER_REGISTER_ENDPOINT = `${backendBaseURL}/user/signup`;
const USER_LOGIN_ENDPOINT = `${backendBaseURL}/user/login`;
const USER_EMAIL_CONFIRMATION_ENDPOINT = `${backendBaseURL}/user/sendEmailConfirm`;

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
      console.log(result);
      if (result.status === 200) {
        const expirationTime = new Date(new Date().getTime() + session_time);
        authCtx.login(result.data.token, expirationTime.toISOString());
        navigate("/");
      }
    })
    .catch((error) => {
      console.log(error);
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

const startAPIHandler = () => {
  console.log("Starting");
};

const editAccountAPIHandler = (userEmail) => {
  // eslint-disable-next-line no-undef
  navigate("/account/edit");
};

export {
  userRegisterAPIHandler,
  userEmailConfirmationAPIHandler,
  userLoginAPIHandler,
  startAPIHandler,
  editAccountAPIHandler,
};
