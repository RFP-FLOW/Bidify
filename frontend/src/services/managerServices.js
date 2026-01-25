import api from "./api";

export const getManagerProfile = async () => {
  const res = await api.get("/company/manager/profile");
  return res.data;
};

export const updateManagerPhone = async (phone) => {
  return api.put("/company/manager/profile", { phone });
};
