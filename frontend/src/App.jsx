import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./context/ThemeContext";
import LandingPage from "./pages/landing.jsx";

import "react-toastify/dist/ReactToastify.css";

//Company
import CompanyLogin from "./pages/Company/companyLogin.jsx";
import AddEmployee from "./pages/Company/AddEmployee.jsx";
import ManagerDashboard from "./pages/Company/ManagerDashboard.jsx";
import AddCompanyProfile from "./pages/Company/Profile.jsx";
import CompanyRegister from "./pages/Company/companyRegister.jsx";
import AcceptedVendors from "./pages/Company/AcceptedVendor.jsx";
import ConfirmedRFPs from "./pages/Company/ConfirmedRFP.jsx";

//Employee
import EmployeeDashboard from "./pages/Employee/EmployeeDashboard.jsx";
import RFPDetails from "./pages/Employee/RFPDetails";
import CreateRFP from "./pages/Employee/CreateRFP";
import Bids from "./pages/Employee/Bids.jsx";
import ForwardToManager from "./pages/Employee/ForwardToManager.jsx";
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
import ApprovedProposals from "./pages/Vendor/ApprovedProposals.jsx";
import MyProposals from "./pages/Vendor/MyProposals.jsx";

//Auth
import SetPassword from "./pages/Password-reset/SetPassword.jsx";
import ForgotPassword from "./pages/Password-reset/ForgotPassword.jsx";
import VerifyOtp from "./pages/OTP/Verify-otp.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PublicRoute from "./components/PublicRoutes.jsx";
import EmployeeSetPassword from "./pages/Employee/EmployeeSetPassword.jsx";
import VendorVerifyOtp from "./pages/OTP/VendorVerifyOtp.jsx";
import VendorProfile from "./pages/Vendor/VendorProfile.jsx";
import ManagerRecommendations from "./pages/Company/ManagerRecommendations.jsx";

function App() {
  return (
    <ThemeProvider>
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
              <ProtectedRoute allowedrole="employee">
                <RfpProposals />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee/rfp/:rfpId/forward"
            element={
              <ProtectedRoute allowedrole="employee">
                <ForwardToManager />
              </ProtectedRoute>
            }
          />

          <Route
            path="/company/register"
            element={
              <PublicRoute>
                <CompanyRegister />
              </PublicRoute>
            }
          />
          <Route
            path="/company/manager/add-employee"
            element={
              <ProtectedRoute allowedrole="manager">
                <AddEmployee />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/profile"
            element={
              <ProtectedRoute allowedrole="manager">
                <AddCompanyProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/vendors"
            element={
              <ProtectedRoute allowedrole="manager">
                <AcceptedVendors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/confirmed"
            element={
              <ProtectedRoute allowedrole="manager">
                <ConfirmedRFPs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/set-password/:token"
            element={<EmployeeSetPassword />}
          />

          <Route
            path="/manager/recommendations"
            element={
              <ProtectedRoute allowedrole="manager">
                <ManagerRecommendations />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee/dashboard"
            element={
              <ProtectedRoute allowedrole="employee">
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/create-rfp"
            element={
              <ProtectedRoute allowedrole="employee">
                <CreateRFP />
              </ProtectedRoute>
            }
          />

          <Route
            path="/vendor/login"
            element={
              <PublicRoute>
                <VendorLogin />
              </PublicRoute>
            }
          />
          <Route
            path="/vendor/register"
            element={
              <PublicRoute>
                <VendorRegister />
              </PublicRoute>
            }
          />
          <Route
            path="/vendor/approved-proposals"
            element={
              <ProtectedRoute allowedrole="vendor">
                <ApprovedProposals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/dashboard"
            element={
              <ProtectedRoute allowedrole="vendor">
                <VendorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/my-proposals"
            element={
              <ProtectedRoute allowedrole="vendor">
                <MyProposals />
              </ProtectedRoute>
            }
          />

          <Route
            path="/rfp/:rfpId"
            element={
              <ProtectedRoute>
                <RFPDetails />
              </ProtectedRoute>
            }
          />

          <Route path="/set-password/:token" element={<SetPassword />} />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />

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
              <ProtectedRoute allowedrole="vendor">
                <VendorCompanies />
              </ProtectedRoute>
            }
          />

          <Route
            path="/vendor/open-rfps"
            element={
              <ProtectedRoute allowedrole="vendor">
                <VendorRFPs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/bids"
            element={
              <ProtectedRoute allowedrole="employee">
                <Bids />
              </ProtectedRoute>
            }
          />

          <Route
            path="/vendor/companies/:id"
            element={
              <ProtectedRoute allowedrole="vendor">
                <VendorCompanyDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/forgot-password"
            element={
              <PublicRoute>
                <VendorForgotPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/vendor/reset-password/:token"
            element={<VendorResetPassword />}
          />
          <Route path="/vendor/verify-otp" element={<VendorVerifyOtp />} />
          <Route
            path="/vendor/profile"
            element={
              <ProtectedRoute allowedrole="vendor">
                <VendorProfile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
