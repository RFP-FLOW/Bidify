import API from "../utils/axiosInstance";

export const getCompanyProfile = async () => {
  const res = await API.get("/company/profile");
  return res.data;
};

export const updateCompanyProfile = async (data) => {
  return API.put("/company/profile", data);
};

export const getAllCompanies = () =>
  API.get("/company/get-AllCompany");

export const getCompanyById = (id) =>
  API.get(`/company/${id}`);