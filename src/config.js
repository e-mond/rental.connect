// src/config.js

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
export const DASHBOARD_BASE_URL = "/dashboard";
export const DEFAULT_PROFILE_PIC = "https://via.placeholder.com/150";

export const CONFIG = {
  BASE_URL,
  DASHBOARD_BASE_URL,
  DEFAULT_PROFILE_PIC,
  API_TIMEOUT: 5000,
};

console.log(`[ENV] Mode: ${import.meta.env.MODE}`);
console.log(`[ENV] Base API URL: ${BASE_URL}`);
