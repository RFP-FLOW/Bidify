import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { toast } from "react-toastify";

function VendorRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    email: "",
    gstNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // GST format (official)
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;

    // prevent spaces in passwords
    if (
      (name === "password" || name === "confirmPassword") &&
      value.includes(" ")
    )
      return;

    // auto-uppercase GST
    if (name === "gstNumber") {
      setFormData({ ...formData, gstNumber: value.toUpperCase() });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const isInvalidName = (value) =>
    /^\d+$/.test(value) || value.trim().length < 3;

  const floatingLabel = (value) =>
    value
      ? "-top-2 text-xs text-[#3a2d97] font-bold"
      : "top-1/2 -translate-y-1/2 text-gray-500 text-sm";

  const handleSubmit = async (e) => {
    e.preventDefault();
     if (!formData.email || !formData.password || !formData.confirmPassword || formData.businessName||formData.gstNumber) {
    toast.error("Please fill all fields");
    return;
    }

    if (!formData.email.includes("@")) {
    toast.error("Please enter a valid email");
    return;
    }
 
    if (isInvalidName(formData.businessName)) {
      toast.error("Business name must contain letters and be at least 3 characters.");
      return;
    }

    if (!gstRegex.test(formData.gstNumber)) {
      toast.error("Invalid GST number. Example: 22AAAAA0000A1Z5");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name: formData.name,
        businessName: formData.businessName,
        gstNumber: formData.gstNumber,
        email: formData.email,
        password: formData.password,
      });

      toast.success("Vendor registered successfully");
      navigate("/vendor/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#fff5d7]">
      <Navbar />

      <div className="flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.15)] bg-white">
          {/* IMAGE */}
          <div className="hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
              alt="Vendor registration"
              className="w-full h-full object-cover"
            />
          </div>

          {/* FORM */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-center mb-8">
              Vendor Sign-Up
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* BUSINESS NAME */}
              <div className="relative">
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50"
                />

                <label
                  className={`absolute left-3 bg-white px-1 ${floatingLabel(formData.businessName)}`}
                >
                  Business Name
                </label>
              </div>
              {/* OWNER NAME */}
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50"
                />
                <label
                  className={`absolute left-3 bg-white px-1 ${floatingLabel(formData.name)}`}
                >
                  Owner Name
                </label>
              </div>

              {/* EMAIL */}
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#3a2d97]/40 outline-none"
                />
                <label
                  className={`absolute left-3 bg-white px-1 transition-all pointer-events-none ${floatingLabel(
                    formData.email,
                  )}`}
                >
                  Email
                </label>
              </div>

              {/* GST */}
              <div className="relative">
                <input
                  type="text"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-sm uppercase border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#3a2d97]/40 outline-none"
                />
                <label
                  className={`absolute left-3 bg-white px-1 transition-all pointer-events-none ${floatingLabel(
                    formData.gstNumber,
                  )}`}
                >
                  GST Number
                </label>
              </div>

              {/* PASSWORD */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#3a2d97]/40 outline-none pr-12"
                />
                <label
                  className={`absolute left-3 bg-white px-1 transition-all pointer-events-none ${floatingLabel(
                    formData.password,
                  )}`}
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[#3a2d97]"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#3a2d97]/40 outline-none pr-12"
                />
                <label
                  className={`absolute left-3 bg-white px-1 transition-all pointer-events-none ${floatingLabel(
                    formData.confirmPassword,
                  )}`}
                >
                  Confirm Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[#3a2d97]"
                ></button>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                className="w-full mt-4 py-3 bg-[#3a2d97] text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all"
              >
                Create Vendor Account
              </button>
            </form>

            <p className="text-center text-sm font-medium text-gray-700 mt-6">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/vendor/login")}
                className="text-[#3a2d97] font-semibold hover:underline"
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorRegister;
