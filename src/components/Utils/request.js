import axios from "axios";
import Constants from "./constants";

axios.defaults.headers.common.Authorization = `bearer ${Constants.API_TOKEN}`;

export default (method, path, data) => {
  const axiosConfig = {
    method,
    url: `${Constants.API_URL}${path}`,
    data
  };

  return axios(axiosConfig);
};
