import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landing.jsx";
import CreateRFP from "./pages/Employee/CreateRFP";
import CompanyLogin from "./pages/Company/companyLogin.jsx";
import AddEmployee from "./pages/Company/AddEmployee.jsx";
import VendorLogin from "./pages/Vendor/vendorLogin.jsx";
import VendorRegister from "./pages/Vendor/vendorRegister.jsx";
import RFPDetails from "./pages/Employee/RFPDetails";
import VendorDashboard from "./pages/Vendor/vendorDashboard.jsx";
import ManagerDashboard from "./pages/Company/ManagerDashboard.jsx";
import EmployeeDashboard from "./pages/Employee/EmployeeDashboard.jsx";
import SetPassword from "./pages/Password-reset/SetPassword.jsx";
import ForgotPassword from "./pages/Password-reset/ForgotPassword.jsx";
import VerifyOtp from "./pages/OTP/Verify-otp.jsx";
import AddCompanyProfile from "./pages/Company/Profile.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CompanyRegister from "./pages/Company/companyRegister.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import VendorRequests from "./pages/Vendor/VendorRequests.jsx";
import VendorCompanies from "./pages/Vendor/VendorCompanies.jsx";
import VendorCompanyDetails from "./pages/Vendor/VendorCompanyDetails.jsx";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/company/login" element={<CompanyLogin />} />
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        <Route path="/company/register" element={<CompanyRegister />} />
        <Route path="/company/manager/add-employee" element={<AddEmployee />} />
        <Route path="/company/profile" element={<AddCompanyProfile />} />

        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee/create-rfp" element={<CreateRFP />} />

        <Route path="/vendor/login" element={<VendorLogin />} />
        <Route path="/vendor/register" element={<VendorRegister />} />
        <Route
          path="/vendor/dashboard"
          element={
            <ProtectedRoute role="vendor">
              <VendorDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/rfp/:rfpId" element={<RFPDetails />} />

        <Route path="/set-password/:token" element={<SetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route
          path="/vendor/requests"
          element={
            <ProtectedRoute>
              <VendorRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/companies"
          element={
            <ProtectedRoute role="vendor">
              <VendorCompanies />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor/companies/:id"
          element={
            <ProtectedRoute role="vendor">
              <VendorCompanyDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
