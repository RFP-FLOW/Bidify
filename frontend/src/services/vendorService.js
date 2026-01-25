// src/services/vendorService.js
import axios from "../utils/axiosInstance";

export const getVendorStats = () => {
  return axios.get("/vendor/dashboard/stats");
};

export const getVendorRFPs = () => {
  return axios.get("/vendor/rfps");
};
