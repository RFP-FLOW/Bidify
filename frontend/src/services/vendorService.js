import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const getVendorStats = () =>
  api.get("/auth/dashboard/stats");
export const sendVendorRequest = (companyId) =>
  api.post("/auth/request", { companyId });
