import api from "./api";

export const getCompanyProfile = async () => {
  const res = await api.get("/company/profile");
  return res.data;
};

export const updateCompanyProfile = async (data) => {
  return api.put("/company/profile", data);
};
