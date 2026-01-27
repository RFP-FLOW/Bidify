import api from "./api";

export const getCompanyProfile = async () => {
  const res = await api.get("/company/profile");
  return res.data;
};

export const updateCompanyProfile = async (data) => {
  return api.put("/company/profile", data);
};

export const getAllCompanies = () =>
  api.get("/company/get-AllCompany");

export const getCompanyById = (id) =>
  api.get(`/company/${id}`);