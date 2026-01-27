import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  CheckCircle,
  Inbox,
  BadgeCheck,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function ManagerSidebar() {
  const [collapsed, setCollapsed] = useState(false);

const handleLogout = () => {
    localStorage.clear();
    navigate("/vendor/login");
  };

  return (

    <aside
      className={`bg-white border-r border-gray-200 transition-all duration-300
      ${collapsed ? "w-20" : "w-64"} p-4`}
    >
      {/* LOGO */}
      <div className="flex items-center justify-between mb-8">
        {!collapsed && (
          <div>
            <h1 className="text-xl font-bold text-[#3a2d97]">Bidify</h1>
            <p className="text-xs text-gray-500">Company Name</p>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-gray-100"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* NAV */}
      <nav className="space-y-1">
        <SidebarItem
          icon={<LayoutDashboard size={18} />}
          label="Dashboard"
          to="/manager/dashboard"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<Users size={18} />}
          label="Add Employee"
          to="/company/manager/add-employee"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<FileText size={18} />}
          label="Active RFPs"
          to="/manager/rfps"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<CheckCircle size={18} />}
          label="Confirmed RFPs"
          to="/manager/confirmed"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<Inbox size={18} />}
          label="Vendor Requests"
          to="/manager/vendors"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<User size={18} />}
          label="Profile"
          to="/company/profile"
          collapsed={collapsed}
        />
      </nav>

      <div className="my-6 border-t border-gray-200" />

      <SidebarItem
         onClick={handleLogout}
        icon={<LogOut size={18} />}
        label="Logout"
        to="/"
        collapsed={collapsed}
      />
    </aside>
  );
}

/* ---- SIDEBAR ITEM ---- */
function SidebarItem({ icon, label, to, collapsed }) {
  return (
    <div className="relative group">
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2 rounded-md transition
          ${
            isActive
              ? "bg-[#eef2ff] text-[#3a2d97] font-medium"
              : "text-gray-700 hover:bg-gray-100"
          }`
        }
      >
        {icon}
        {!collapsed && label}
      </NavLink>

      {collapsed && (
        <span
          className="absolute left-14 top-1/2 -translate-y-1/2
          whitespace-nowrap rounded-md bg-gray-900 px-3 py-1.5
          text-xs text-white opacity-0 group-hover:opacity-100"
        >
          {label}
        </span>
      )}
    </div>
  );
}

export default ManagerSidebar;
