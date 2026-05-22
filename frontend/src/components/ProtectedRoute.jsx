import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedrole }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  

  if (!token) {
    if(allowedrole==="manager"){
       return <Navigate to="/company/login" replace/>;
    }
    return <Navigate to="/vendor/login" replace />;
  }

  if(allowedrole && role!==allowedrole){
    return <Navigate to="/" replace/>;
  }
  return children;
};

export default ProtectedRoute;
