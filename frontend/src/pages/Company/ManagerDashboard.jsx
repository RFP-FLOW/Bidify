import { useState } from "react";
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

function ManagerDashboard() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#fff5d7] flex">

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`bg-white border-r border-gray-200 transition-all duration-300
        ${collapsed ? "w-20" : "w-64"} p-4`}
      >
        {/* LOGO + TOGGLE */}
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

        {/* NAV ITEMS */}
        <nav className="space-y-1">
          <SidebarItem
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            collapsed={collapsed}
            active
          />
          <SidebarItem
            icon={<Users size={18} />}
            label="Add Employee"
            collapsed={collapsed}
          />
          <SidebarItem
            icon={<FileText size={18} />}
            label="Active RFPs"
            collapsed={collapsed}
          />
          <SidebarItem
            icon={<CheckCircle size={18} />}
            label="Confirmed RFPs"
            collapsed={collapsed}
          />
          <SidebarItem
            icon={<Inbox size={18} />}
            label="Vendor Requests"
            collapsed={collapsed}
          />
          <SidebarItem
            icon={<BadgeCheck size={18} />}
            label="Approved Vendors"
            collapsed={collapsed}
          />
          <SidebarItem
            icon={<User size={18} />}
            label="Profile"
            collapsed={collapsed}
          />
        </nav>

        {/* DIVIDER */}
        <div className="my-6 border-t border-gray-200" />

        {/* LOGOUT */}
        <SidebarItem
          icon={<LogOut size={18} />}
          label="Logout"
          collapsed={collapsed}
        />
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            Welcome, Manager <span>👋</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Here’s what’s happening in your company today
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StatCard title="Active RFPs" value="6" />
          <StatCard title="Confirmed RFPs" value="2" />
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-5 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">
              Recent Vendor Requests
            </h3>
          </div>

          <table className="w-full text-sm">
            <tbody>
              {[
                "Vendor A – Laptop Supplier",
                "Vendor B – Sensor Supplier",
              ].map((vendor) => (
                <tr
                  key={vendor}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-5 py-4">{vendor}</td>
                  <td className="px-5 py-4 text-right">
                    <button className="px-4 py-1.5 rounded-md bg-[#3a2d97] text-white text-sm">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function SidebarItem({ icon, label, collapsed, active }) {
  return (
    <div className="relative group">
      <button
        className={`flex items-center gap-3 w-full px-3 py-2 rounded-md transition
        ${
          active
            ? "bg-[#eef2ff] text-[#3a2d97] font-medium"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        {icon}
        {!collapsed && label}
      </button>

      {/* TOOLTIP (only when collapsed) */}
      {collapsed && (
        <span
          className="absolute left-14 top-1/2 -translate-y-1/2
          whitespace-nowrap rounded-md bg-gray-900 px-3 py-1.5
          text-xs text-white opacity-0 group-hover:opacity-100
          transition pointer-events-none z-50"
        >
          {label}
        </span>
      )}
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-semibold text-gray-900 mt-1">
        {value}
      </p>
    </div>
  );
}

export default ManagerDashboard;
