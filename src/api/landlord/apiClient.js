import axios from "axios";
import { BASE_URL } from "../../config";
import {
  fetchProperties,
  fetchAllProperties,
  addProperty,
  updateProperty,
  deleteProperty,
} from "./propertiesApi";

// Add axios interceptor to preserve multipart/form-data
axios.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      console.log(
        "[landlordApi] Interceptor: FormData detected, preserving Content-Type"
      );
      delete config.headers["Content-Type"]; // Let axios set multipart/form-data
    } else if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }
    console.log("[landlordApi] Interceptor: Request headers:", config.headers);
    return config;
  },
  (error) => {
    console.error("[landlordApi] Interceptor: Request error:", error);
    return Promise.reject(error);
  }
);

// Set Axios base URL
axios.defaults.baseURL = BASE_URL;

const landlordApi = {
  baseUrl: BASE_URL,
  fetchProperties,
  fetchAllProperties,
  addProperty,
  updateProperty,
  deleteProperty,
};

export default landlordApi;
