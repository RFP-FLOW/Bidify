import api from "./api";

/**
 * Create a new RFP (DRAFT)
 */
export const createRFP = (rfpData) => {
  return api.post("/rfp", rfpData);
};

/**
 * Get all RFPs of logged-in employee
 */
export const getEmployeeRFPs = () => {
  return api.get("/rfp/employee");
};

/**
 * Get dashboard stats
 */
export const getRFPStats = () => {
  return api.get("/rfp/stats");
};

export const getConfirmedRFPs = () => {
   return api.get("/rfp/confirmed");
};
