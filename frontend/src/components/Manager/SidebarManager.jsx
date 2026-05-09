import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { LayoutDashboard, Users, CheckCircle, Inbox, User, BadgeCheck, LogOut, Sun, Moon, FileText } from "lucide-react";

const navItems = [
  { label: "Dashboard",       path: "/manager/dashboard",            icon: LayoutDashboard },
  { label: "Employee",        path: "/company/manager/add-employee", icon: Users },
  { label: "Confirmed RFPs",  path: "/manager/confirmed",           icon: CheckCircle },
  { label: "Vendors",         path: "/manager/vendors",             icon: Inbox },
  { label: "Recommendations", path: "/manager/recommendations",     icon: BadgeCheck },
  { label: "Profile",         path: "/company/profile",             icon: User },
];

export default function SidebarManager() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const companyName = user?.companyName || "Company";

  return (
    <aside className="h-screen w-[260px] flex flex-col justify-between sticky top-0 transition-colors duration-300 bg-card" style={{ borderRight: "1px solid var(--border-color)" }}>
      <div className="px-5 pt-7 pb-4">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--accent)" }}><FileText size={16} className="text-white" /></div>
          <div><span className="t-primary text-[15px] font-bold tracking-[-0.02em] block leading-tight">{companyName}</span><span className="t-muted text-[11px] font-medium">Manager Portal</span></div>
        </div>
        <p className="t-muted text-[11px] uppercase tracking-[0.1em] font-semibold mb-3 px-3">Menu</p>
        <nav className="space-y-1">
          {navItems.map(({ label, path, icon: Icon }) => {
            const active = pathname === path;
            return (
              <button key={path} onClick={() => navigate(path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 ${active ? "" : "hover:bg-[var(--bg-hover)]"}`}
                style={active ? { color: "#fff", background: "var(--accent)", boxShadow: "0 2px 8px rgba(37,99,235,0.25)" } : { color: "var(--text-secondary)" }}>
                <Icon size={17} strokeWidth={active ? 2.2 : 1.8} />{label}
              </button>
            );
          })}
        </nav>
      </div>
      <div className="px-5 pb-6 space-y-2">
        <button onClick={toggleTheme} className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-medium bg-elevated b-default transition-all duration-200 hover:brightness-95 t-secondary">
          <span className="flex items-center gap-2.5">{theme === "dark" ? <Moon size={15} /> : <Sun size={15} />}{theme === "dark" ? "Dark mode" : "Light mode"}</span>
          <div className="w-9 h-5 rounded-full relative transition-colors duration-300" style={{ background: theme === "dark" ? "var(--accent)" : "#d1d5db" }}>
            <div className="absolute top-[3px] w-[14px] h-[14px] rounded-full bg-white transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]" style={{ left: theme === "dark" ? "19px" : "3px", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
          </div>
        </button>
        <button onClick={() => { localStorage.clear(); navigate("/company/login"); }}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium t-secondary transition-all duration-200 hover:text-red-500 hover:bg-red-50">
          <LogOut size={15} strokeWidth={1.8} /> Log out
        </button>

      </div>
    </aside>
  );
}
