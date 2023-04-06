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

const postRecordAPIHandler = async (token, recordDataToPost) => {
  /* recordDataToPost is a object which can have upto 3 field(s)
    1. patientId  (String) -> "" if no patientId provided
    2. finished (bool) -> 'true' when the user finishing the record, 'false' when automatically updated during recording
    3. recordData (object) -> information
  */
  console.log("posting record to backend -> database")
  console.log(recordDataToPost)
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const result = await axios.post(RECORD_ENDPOINT, recordDataToPost, config);
  console.log(result)
}

export { fetchUserLatestRecordAPIHandler, postRecordAPIHandler };