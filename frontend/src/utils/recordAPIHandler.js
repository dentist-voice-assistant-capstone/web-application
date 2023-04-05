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
  console.log("posting record to backend -> database")
  console.log(recordDataToPost)
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const result = await axios.post(RECORD_ENDPOINT, recordDataToPost, config);
  console.log(result)
}

export { fetchUserLatestRecordAPIHandler, postRecordAPIHandler };