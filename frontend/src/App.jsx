import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landing";
import CompanyLogin from "./pages/companylogin";
import CompanyRegister from "./pages/companyregistar";
import VendorLogin from "./pages/vendorlogin";
import VendorRegister from "./pages/vendorregister";
import ProtectedRoute from "./components/ProtectedRoute";
import VendorDashboard from "./pages/VendorDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/company/login" element={<CompanyLogin />} />
        <Route path="/company/register" element={<CompanyRegister />} />
        <Route path="/vendor/login" element={<VendorLogin />} />
        <Route path="/vendor/register" element={<VendorRegister />} />
        <Route path="/vendor/dashboard" element={<VendorDashboard />} />
        <Route path="/vendor/dashboard" element={<ProtectedRoute /> }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
