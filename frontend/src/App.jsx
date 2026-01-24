import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landing.jsx";
import CreateRFP from "./pages/Employee/CreateRFP";
import CompanyLogin from "./pages/Company/companyLogin.jsx";
import CompanyRegister from "./pages/Company/companyRegister.jsx";
import AddEmployee from "./pages/Company/AddEmployee.jsx";
import VendorLogin from "./pages/Vendor/vendorLogin.jsx";
import VendorRegister from "./pages/Vendor/vendorRegister.jsx";
import RFPDetails from "./pages/Employee/RFPDetails";
import VendorDashboard from "./pages/Vendor/vendorDashboard.jsx";
import ManagerDashboard from "./pages/Company/ManagerDashboard.jsx";
import EmployeeDashboard from "./pages/Employee/EmployeeDashboard.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  return (
    <BrowserRouter>
       <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/company/login" element={<CompanyLogin />} />  
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        <Route path="/company/register" element={<CompanyRegister />} />
        <Route path="/manager/add-employee" element={<AddEmployee />} />
        
         <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
         <Route path="/employee/create-rfp"  element={<CreateRFP />} />

       
        <Route path="/vendor/login" element={<VendorLogin />} />
        <Route path="/vendor/register" element={<VendorRegister />} />
        <Route path="/vendor/dashboard" element={<VendorDashboard />} />

        <Route path="/rfp/:rfpId" element={<RFPDetails />} />
        {/* <Route path="/vendor/dashboard" element={<ProtectedRoute /> />} */}
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
