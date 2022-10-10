import axios from "axios";

const backendBaseURL = 'http://localhost:3000'

const USER_REGISTER_ENDPOINT = `${backendBaseURL}/user/signup`;

const userRegisterAPIHandler = (userRegisterData, setReigsterError, setIsEmailDuplicated, navigate) => {
  axios.post(USER_REGISTER_ENDPOINT, userRegisterData)
    .then(result => {
      // register completed 
      if (result.status === 201) {
        navigate('/register/email_confirmation', { state: { email: userRegisterData.email } })
      }

    }).catch(error => {
      // cannot connect to backend server
      if (!error.response) {
        setReigsterError({
          header: "Connection Error",
          content: <p>Cannot connect to backend server.</p>
        })
        return false
      }

      // the email is already been used
      if (error.response.status === 400 && error.response.data.message.startsWith('Duplicate field value: {"email":')) {
        setReigsterError({
          header: "Cannot Register: Duplicated Email",
          content: <p><b>{userRegisterData.email}</b> has already been used. Please try again using another email.</p>
        })
        setIsEmailDuplicated(true)
      } else if (error.response.status === 500) { // some unknown errors
        setReigsterError({
          header: "Something Wrong!",
          content: <p>Something went wrong! Please try again later</p>
        })
      }
      return false
    })
}

export {
  userRegisterAPIHandler
}