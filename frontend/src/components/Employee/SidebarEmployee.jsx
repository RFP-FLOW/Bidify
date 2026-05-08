import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import {
  LayoutDashboard,
  FilePlus,
  Gavel,
  LogOut,
  Sun,
  Moon,
  FileText,
} from "lucide-react";

const navItems = [
  { label: "Dashboard",   path: "/employee/dashboard",  icon: LayoutDashboard },
  { label: "Create RFP",  path: "/employee/create-rfp", icon: FilePlus },
  { label: "Vendor Bids", path: "/employee/bids",       icon: Gavel },
];

export default function SidebarEmployee() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/company/login");
  };

  return (
    <aside
      style={{
        background: "var(--bg-sidebar)",
        borderRight: "1px solid var(--border-color)",
      }}
      className="h-screen w-[260px] flex flex-col justify-between sticky top-0 transition-colors duration-300"
    >
      {/* ── TOP ── */}
      <div className="px-5 pt-7 pb-4">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 px-2">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "var(--accent)" }}
          >
            <FileText size={16} className="text-white" />
          </div>
          <div>
            <span style={{ color: "var(--text-primary)" }}
              className="text-[15px] font-bold tracking-[-0.02em] block leading-tight">
              Bidify
            </span>
            <span style={{ color: "var(--text-muted)" }}
              className="text-[11px] font-medium">
              RFP Portal
            </span>
          </div>
        </div>

        {/* Section label */}
        <p style={{ color: "var(--text-muted)" }}
          className="text-[11px] uppercase tracking-[0.1em] font-semibold mb-3 px-3">
          Menu
        </p>

        {/* Nav */}
        <nav className="space-y-1">
          {navItems.map(({ label, path, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                style={{
                  color: isActive ? "#ffffff" : "var(--text-secondary)",
                  background: isActive ? "var(--accent)" : "transparent",
                  boxShadow: isActive ? "0 2px 8px rgba(37, 99, 235, 0.25)" : "none",
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold
                  transition-all duration-200
                  ${!isActive ? "hover:bg-[var(--bg-hover)]" : ""}
                `}
              >
                <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} />
                {label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── BOTTOM ── */}
      <div className="px-5 pb-6 space-y-2">

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            color: "var(--text-secondary)",
            background: "var(--bg-hover)",
            border: "1px solid var(--border-color)",
          }}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-medium
            transition-all duration-200 hover:brightness-95"
        >
          <span className="flex items-center gap-2.5">
            {theme === "dark"
              ? <Moon size={15} strokeWidth={1.8} />
              : <Sun size={15} strokeWidth={1.8} />
            }
            {theme === "dark" ? "Dark mode" : "Light mode"}
          </span>

          {/* Toggle pill */}
          <div
            className="w-9 h-5 rounded-full relative transition-colors duration-300"
            style={{
              background: theme === "dark" ? "var(--accent)" : "#d1d5db",
            }}
          >
            <div
              className="absolute top-[3px] w-[14px] h-[14px] rounded-full bg-white transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              style={{
                left: theme === "dark" ? "19px" : "3px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              }}
            />
          </div>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{ color: "var(--text-secondary)" }}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium
            transition-all duration-200 hover:text-red-500 hover:bg-red-50"
        >
          <LogOut size={15} strokeWidth={1.8} />
          Log out
        </button>

        {/* Divider + help */}
        <div className="pt-3 mt-1"
          style={{ borderTop: "1px solid var(--border-color)" }}>
          <p style={{ color: "var(--text-muted)" }}
            className="text-[11px] text-center">
            Need help?{" "}
            <span style={{ color: "var(--accent-text)" }}
              className="cursor-pointer hover:underline font-medium">
              Support
            </span>
          </p>
        </div>
      </div>
    </aside>
  );
}