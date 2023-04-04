import axios from "axios";
import { URL_BACKEND } from "./constants";

const RECORD_ENDPOINT = `${URL_BACKEND}/record`

const fetchUserLatestRecordAPIHandler = async (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const result = await axios.get(RECORD_ENDPOINT, config);
  console.log(result)
  if (result.status === 200) {
    return result.data.data
  }
}

export { fetchUserLatestRecordAPIHandler };