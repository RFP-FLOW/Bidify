import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/vendor/login" replace />;
  }

  // OPTIONAL: role-based check later
  return children;
};

export default ProtectedRoute;
