import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function CompanyLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // prevent spaces in password
    if (name === "password" && value.includes(" ")) return;

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
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
              alt="Company login"
              className="w-full h-full object-cover"
            />
          </div>

          {/* FORM */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-center mb-8">
              Company Login
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">

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
                  className={`
                    absolute left-3 bg-white px-1 transition-all duration-200 pointer-events-none
                    ${
                      formData.email
                        ? "-top-2 text-xs text-[#3a2d97] font-bold"
                        : "top-1/2 -translate-y-1/2 text-gray-500 text-sm"
                    }
                  `}
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
                  className={`
                    absolute left-3 bg-white px-1 transition-all duration-200 pointer-events-none
                    ${
                      formData.password
                        ? "-top-2 text-xs text-[#3a2d97] font-bold"
                        : "top-1/2 -translate-y-1/2 text-gray-500 text-sm"
                    }
                  `}
                >
                  Password
                </label>

                {/* Eye icon (shifted left) */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[#3a2d97]"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>

              {/* ROLE */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-600 font-medium">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#3a2d97]/40 outline-none"
                >
                  <option value="">Select Role</option>
                  <option value="manager">Manager</option>
                  <option value="employee">Employee</option>
                </select>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                className="w-full mt-4 py-3 bg-[#3a2d97] text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all"
              >
                Login
              </button>
            </form>

            {/* SIGNUP LINK */}
            <p className="text-center text-sm font-medium text-gray-700 mt-6">
              Don’t have an account?{" "}
              <button
                onClick={() => navigate("/company/register")}
                className="text-[#3a2d97] font-semibold hover:underline"
              >
                Sign up here
              </button>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyLogin;
