import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../config/Urls";
import Storage from "../utils/HandelLocalStorage";

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 18000,
  params: {},
});

// instance.defaults.headers.post['Content-Type'] = 'multipart/form-data';
// instance.defaults.headers.post['Content-Type'] = 'application/json';
let token = "";
Storage.retrieveItem("userDetails").then((params) => {
  // console.log("Async User form axios", params);
  if (params === null || params === undefined || params === "") {
  } else {
    const userDetails = JSON.parse(params);
    token = userDetails?.token;
  }
});

// Add a request interceptor
instance.interceptors.request.use(
  function (config: any) {
    if (token) {
      // config.headers["Authorization"] = "Bearer " + token;
      config.headers.Authorization = token;
    }
    // console.log("++++++++++Request Config++++++++++", JSON.stringify(config));
    return config;
  },
  function (error: any) {
    // return Promise.reject(error);
    console.log("error from interceptor request", error);
    return Promise.reject(error);
    // return error;
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response: any) {
    // console.log('++++++++++Response Config++++++++++', response);
    return response;
  },
  function (error: any) {
    console.log("error from interceptor response", error);
    if (error.response.status === 400) {
      toast.error(error.response.data.message);
    } else {
      toast.error(error.response.data.message);
    }
    return Promise.reject(error);
    // if (error) return error;
  }
);


export default instance;
