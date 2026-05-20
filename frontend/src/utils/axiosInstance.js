import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// REQUEST INTERCEPTOR
instance.interceptors.request.use((config) => {

  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});

// RESPONSE INTERCEPTOR
instance.interceptors.response.use(
  (response) => response,

  async (error) => {

    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {

      originalRequest._retry = true;

      try {

        const res = await axios.post(
          "http://localhost:5000/api/commonauth/refresh-token",
          {},
          {
            withCredentials: true,
          }
        );

        const newAccessToken =
          res.data.accessToken;

        localStorage.setItem(
          "accessToken",
          newAccessToken
        );

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return instance(originalRequest);

      } catch (refreshError) {

        console.log(refreshError);

        const role =
          localStorage.getItem("role");

        localStorage.clear();

        if (role === "vendor") {
          window.location.href =
            "/vendor/login";
        } else {
          window.location.href =
            "/company/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default instance;