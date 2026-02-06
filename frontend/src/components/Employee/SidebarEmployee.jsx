// components/Employee/Sidebar.jsx
import { useNavigate } from "react-router-dom";
import { colors } from "../../theme/colors";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/company/login");
  };

  return (
    <div
      className="h-screen w-64 p-6 text-white flex flex-col justify-between"
      style={{ background: colors.primary }}
    >
      {/* TOP */}
      <div>
        <h1 className="text-xl font-bold mb-8">RFP Management</h1>

        <ul className="space-y-4">
          <li
            onClick={() => navigate("/employee/dashboard")}
            className="cursor-pointer font-semibold hover:opacity-80"
          >
            Dashboard
          </li>

          <li
            onClick={() => navigate("/employee/create-rfp")}
            className="cursor-pointer hover:opacity-80"
          >
            Create RFP
          </li>

          <li
            onClick={() => navigate("/employee/bids")}
            className="cursor-pointer hover:opacity-80"
          >
            Vendor Bids
          </li>
        </ul>
      </div>

      {/* BOTTOM */}
      <div className="space-y-4">
        <div className="text-sm opacity-80">
          Need Help? <br /> Check Documentation
        </div>

       <button
  onClick={handleLogout}
  className="w-full border border-white/30 text-white/80 py-2 rounded-lg text-sm
             hover:bg-white/10 hover:text-white transition"
>
  Logout
</button>

      </div>
    </div>
  );
}
