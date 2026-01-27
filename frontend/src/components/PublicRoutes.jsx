import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (token && role === "manager") {
    return <Navigate to="/manager/dashboard" replace />;
  }

  if (token && role === "vendor") {
    return <Navigate to="/vendor/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
