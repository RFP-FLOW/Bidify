import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import LandingPage from "./pages/landing.jsx";

import "react-toastify/dist/ReactToastify.css";

//Company
import CompanyLogin from "./pages/Company/companyLogin.jsx";
import AddEmployee from "./pages/Company/AddEmployee.jsx";
import ManagerDashboard from "./pages/Company/ManagerDashboard.jsx";
import AddCompanyProfile from "./pages/Company/Profile.jsx";
import CompanyRegister from "./pages/Company/companyRegister.jsx";
import AcceptedVendors from "./pages/Company/AcceptedVendor.jsx";

//Employee
import EmployeeDashboard from "./pages/Employee/EmployeeDashboard.jsx";
import RFPDetails from "./pages/Employee/RFPDetails";
import CreateRFP from "./pages/Employee/CreateRFP";
import Bids from "./pages/Employee/Bids.jsx";
import RfpProposals from "./pages/Employee/RfpProposals.jsx";

//Vendor
import VendorLogin from "./pages/Vendor/vendorLogin.jsx";
import VendorRegister from "./pages/Vendor/vendorRegister.jsx";
import VendorDashboard from "./pages/Vendor/vendorDashboard.jsx";
import VendorRequests from "./pages/Vendor/VendorRequests.jsx";
import VendorCompanies from "./pages/Vendor/VendorCompanies.jsx";
import VendorCompanyDetails from "./pages/Vendor/VendorCompanyDetails.jsx";
import VendorRFPs from "./pages/Vendor/vendorRFPs.jsx";
import VendorForgotPassword from "./pages/Password-reset/VendorForgotPassword";
import VendorResetPassword from "./pages/Password-reset/VendorSetPassword";

//Auth
import SetPassword from "./pages/Password-reset/SetPassword.jsx";
import ForgotPassword from "./pages/Password-reset/ForgotPassword.jsx";
import VerifyOtp from "./pages/OTP/Verify-otp.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PublicRoute from "./components/PublicRoutes.jsx";
import EmployeeSetPassword from "./pages/Employee/EmployeeSetPassword.jsx";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          }
        />

        <Route
          path="/company/login"
          element={
            <PublicRoute>
              <CompanyLogin />
            </PublicRoute>
          }
        />
        <Route
          path="/manager/dashboard"
          element={
            <ProtectedRoute allowedrole="manager">
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/rfp/:rfpId/proposals"
          element={
            <ProtectedRoute>
              <RfpProposals />
            </ProtectedRoute>
          }
        />

        <Route path="/company/register" element={<CompanyRegister />} />
        <Route path="/company/manager/add-employee" element={<AddEmployee />} />
        <Route path="/company/profile" element={<AddCompanyProfile />} />
        <Route path="/manager/vendors" element={<AcceptedVendors />} />
        <Route
          path="/employee/set-password/:token"
          element={<EmployeeSetPassword />}
        />

        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee/create-rfp" element={<CreateRFP />} />

        <Route
          path="/vendor/login"
          element={
            <PublicRoute>
              <VendorLogin />
            </PublicRoute>
          }
        />
        <Route path="/vendor/register" element={<VendorRegister />} />

        <Route
          path="/vendor/dashboard"
          element={
            <ProtectedRoute allowedrole="vendor">
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

        <Route path="/vendor/rfps" element={<VendorRFPs />} />
        <Route
          path="/employee/bids"
          element={
            <ProtectedRoute>
              <Bids />
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
        <Route
          path="/vendor/forgot-password"
          element={<VendorForgotPassword />}
        />
        <Route
          path="/vendor/reset-password/:token"
          element={<VendorResetPassword />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
