import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landing.jsx";
import CompanyLogin from "./pages/Company/companyLogin.jsx";
import CompanyRegister from "./pages/Company/companyRegister.jsx";
import VendorLogin from "./pages/Vendor/vendorLogin.jsx";
import VendorRegister from "./pages/Vendor/vendorRegister.jsx";
import VendorDashboard from "./pages/Vendor/vendorDashboard.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  return (
    <BrowserRouter>
       <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/company/login" element={<CompanyLogin />} />
        <Route path="/company/register" element={<CompanyRegister />} />
        <Route path="/vendor/login" element={<VendorLogin />} />
        <Route path="/vendor/register" element={<VendorRegister />} />
        <Route path="/vendor/dashboard" element={<VendorDashboard />} />
        {/* <Route path="/vendor/dashboard" element={<ProtectedRoute /> />} */}
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
