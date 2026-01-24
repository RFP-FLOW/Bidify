import axios from "axios";

// create axios instance
const API = axios.create({
  baseURL: "http://localhost:5000/api", // change if needed
});

// attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  console.log("AXIOS TOKEN:", token); // 👈 TEMP
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});




/**
 * Create a new RFP (DRAFT)
 */
export const createRFP = (rfpData) => {
  return API.post("/rfp", rfpData);
};

/**
 * Get all RFPs of logged-in employee
 */
export const getEmployeeRFPs = () => {
  return API.get("/rfp/employee");
};

/**
 * Get dashboard stats
 */
export const getRFPStats = () => {
  return API.get("/rfp/stats");
};
