import { useState } from "react";
import { NavLink ,useNavigate} from "react-router-dom";
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

function ManagerSidebar({companyName}) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate(); 

const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/company/login");
  };


  return (

    <aside
  className={`top-16 left-0 z-40 sticky top-0 bg-white border-r border-gray-200 transition-all duration-300
  ${collapsed ? "w-24" : "w-64"} px-4 py-6 h-[calc(100vh-4rem)] flex flex-col`}
>

      {/* LOGO */}
      <div className="flex items-center justify-between mb-10">
        {!collapsed && (
          <div className="relative pl-3">
          
            <p className="text-lg font-bold text-gray-700 truncate max-w-[180px]">{companyName}</p>
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
      <nav className="flex-1 px-2 space-y-4 mt-6       ">
        <SidebarItem
          icon={<LayoutDashboard size={18} />}
          label="Dashboard"
          to="/manager/dashboard"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<Users size={18} />}
          label="Employee"
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
          label="Vendor"
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

     <button
         onClick={handleLogout}
         className="group relative w-full">
        <div
             className={`relative flex items-center h-12
             ${collapsed ? "w-12 justify-center" : "w-full px-8 gap-4"}
             rounded-xl transition-all text-base font-medium
             text-gray-700
             hover:bg-[#eef2ff] hover:text-[#3a2d97]
             active:bg-[#e0e7ff]`}
         >
    {/* LEFT BAR – SAME AS DASHBOARD */}
         <span
              className="absolute left-0 top-0 h-full w-1
                 rounded-r-full bg-[#3a2d97]
                  opacity-0 group-hover:opacity-100 transition-opacity"
          />
        <span className="text-lg">
            <LogOut size={18} />
        </span>

           {!collapsed && <span>Logout</span>}
     </div>

        {collapsed && (
           <span
               className="absolute left-14 top-1/2 -translate-y-1/2
                 whitespace-nowrap rounded-md bg-gray-900
                 px-3 py-1.5 text-sm text-white
                 opacity-0 group-hover:opacity-100" >
              Logout
            </span>
          )}
       </button>

    </aside>
  );
}

/* ---- SIDEBAR ITEM ---- */
function SidebarItem({ icon, label, to, collapsed }) {
  return (
    <div className="relative group flex justify-" >
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center w-full h-12 gap-4 px-8 py-3 rounded-lg transition-all text-base font-medium
          ${collapsed ? "w-12 mx-auto justify-center" : "w-full px-8 gap-4"} 
        ${
            isActive
              ? "bg-[#eef2ff] text-[#3a2d97] border-[#3a2d97] border-l-4 font-medium"
              : "text-gray-700 hover:bg-gray-100"
          }`
        }
      >
        <span className="text-lg">{icon}</span>
        {!collapsed && <span>{label}</span>}
      </NavLink>

      {collapsed && (
        <span
          className="absolute left-16 top-1/2 -translate-y-1/2
          whitespace-nowrap rounded-md bg-gray-900 px-3 py-1.5
          text-sm text-white opacity-0 group-hover:opacity-100"
        >
          {label}
        </span>
      )}
    </div>
  );
}

export default ManagerSidebar;
