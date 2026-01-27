import api from "./api";

export const getManagerProfile = async () => {
  const res = await api.get("/company/manager/profile");
  return res.data;
};

export const updateManagerPhone = async (phone) => {
  return api.put("/company/manager/profile", { phone });
};


export const getPendingRequests = () =>
  api.get("/manager-vendor/vendor-requests");

export const acceptRequest = (id) =>
  api.patch(`/manager-vendor/vendor-requests/${id}/accept`);

export const rejectRequest = (id) =>
  api.patch(`/manager-vendor/vendor-requests/${id}/reject`);