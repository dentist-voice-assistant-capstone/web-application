import axios from "axios";
import { URL_BACKEND } from "./constants";

const RECORD_ENDPOINT = `${URL_BACKEND}/record`

const fetchUserLatestRecordAPIHandler = async (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const result = await axios.get(RECORD_ENDPOINT, config);
  if (result.status === 200) {
    return result.data.data
  }
}

const postRecordAPIHandler = async (token, recordData, patientId = "", finished = false) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const recordDataToPost = {
    patientId: patientId,
    finished: finished,
    recordData: recordData
  }

  const result = await axios.post(RECORD_ENDPOINT, recordDataToPost, config);
  console.log("posting record to backend -> database")
  console.log(result)
}

export { fetchUserLatestRecordAPIHandler, postRecordAPIHandler };

