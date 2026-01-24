import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { toast } from "react-toastify";

function CompanyRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;

    // prevent spaces in passwords
    if (
      (name === "password" || name === "confirmPassword") &&
      value.includes(" ")
    )
      return;

    setFormData({ ...formData, [name]: value });
  };

  const isInvalidName = (value) =>
    /^\d+$/.test(value) || value.trim().length < 3;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
     if (!formData.email || !formData.password || !formData.confirmPassword || !formData.companyName|| !formData.username) {
    toast.error("Please fill all fields");
    return;
    }

 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

   if (!emailRegex.test(formData.email)) {
    toast.error("Please enter a valid email address");
    return;
   }

    if (isInvalidName(formData.companyName)) {
      toast.error("Company name must contain letters and be at least 3 characters.");
      return;
    }

    if (isInvalidName(formData.username)) {
      toast.error("Username must contain letters and be at least 3 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
     


    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/company/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            companyName: formData.companyName,
            username: formData.username,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Registration failed");
        return;
      }

      toast.success("Company registered successfully 🎉");
      navigate("/company/login");
    } catch (error) {
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const floatingLabel = (value) =>
    value
      ? "-top-2 text-xs text-[#3a2d97] font-bold"
      : "top-1/2 -translate-y-1/2 text-gray-500 text-sm";

  return (
    <div className="min-h-screen bg-[#fff5d7]">
      <Navbar />

      <div className="flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.15)] bg-white">

          {/* IMAGE */}
          <div className="hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
              alt="Company registration"
              className="w-full h-full object-cover"
            />
          </div>

          {/* FORM */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-center mb-8">
              Company Sign-Up
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* COMPANY NAME */}
              <div className="relative">
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#3a2d97]/40 focus:border-[#3a2d97] outline-none"
                />
                <label
                  className={`absolute left-3 bg-white px-1 transition-all duration-200 pointer-events-none ${floatingLabel(
                    formData.companyName
                  )}`}
                >
                  Company Name
                </label>
              </div>

              {/* USERNAME */}
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#3a2d97]/40 focus:border-[#3a2d97] outline-none"
                />
                <label
                  className={`absolute left-3 bg-white px-1 transition-all duration-200 pointer-events-none ${floatingLabel(
                    formData.username
                  )}`}
                >
                  Username
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
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#3a2d97]/40 focus:border-[#3a2d97] outline-none"
                />
                <label
                  className={`absolute left-3 bg-white px-1 transition-all duration-200 pointer-events-none ${floatingLabel(
                    formData.email
                  )}`}
                >
                  Email
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
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#3a2d97]/40 focus:border-[#3a2d97] outline-none pr-12"
                />
                <label
                  className={`absolute left-3 bg-white px-1 transition-all duration-200 pointer-events-none ${floatingLabel(
                    formData.password
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
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#3a2d97]/40 focus:border-[#3a2d97] outline-none pr-12"
                />
                <label
                  className={`absolute left-3 bg-white px-1 transition-all duration-200 pointer-events-none ${floatingLabel(
                    formData.confirmPassword
                  )}`}
                >
                  Confirm Password
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[#3a2d97]"
                >
                  {showConfirmPassword ? "🙈" : "👁"}
                </button>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                className="w-full mt-4 py-3 bg-[#3a2d97] text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all"
              >
                Create Company Account
              </button>
            </form>

            {/* LOGIN LINK */}
            <p className="text-center text-sm font-medium text-gray-700 mt-6">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/company/login")}
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

export default CompanyRegister;
