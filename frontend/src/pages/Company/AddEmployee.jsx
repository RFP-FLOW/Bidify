import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import ManagerLayout from "../../components/Manager/SidebarCardManager";
import { Card, IconBox } from "../../components/ui/Themed";
import { UserPlus, Users, UserCheck, Clock, Search, Mail, RotateCcw, X, Send, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

const PER_PAGE = 5;

function AddEmployee() {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchEmployees = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/company/manager/employees", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message);
      setEmployees(data.employees);
    } catch { toast.error("Failed to load employees"); }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!formData.name || !formData.email) return toast.error("Please fill all fields");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return toast.error("Enter a valid email");
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/company/manager/add-employee", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` }, body: JSON.stringify(formData) });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message || "Failed");
      toast.success(data.type === "resent" ? "Invitation re-sent 📩" : "Employee invited 🎉");
      setFormData({ name: "", email: "" }); setShowForm(false); fetchEmployees();
    } catch { toast.error("Server error"); }
    finally { setLoading(false); }
  };

  const handleResend = async (emp) => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/company/manager/add-employee", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` }, body: JSON.stringify({ name: emp.name, email: emp.email }) });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message || "Failed");
      toast.success("Invitation re-sent 📩"); fetchEmployees();
    } catch { toast.error("Server error"); }
    finally { setLoading(false); }
  };

  // Computed
  const active = employees.filter(e => e.status === "active").length;
  const pending = employees.filter(e => e.status !== "active").length;
  const filtered = employees.filter(e => !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const avatarColors = ["#4F46E5", "#0891B2", "#059669", "#D97706", "#DC2626", "#7C3AED"];
  const getColor = (name) => avatarColors[name.charCodeAt(0) % avatarColors.length];

  const stats = [
    { label: "Total Employees", value: employees.length, sub: "All team members", icon: Users, variant: "stat1" },
    { label: "Active Employees", value: active, sub: "Currently active", icon: UserCheck, variant: "stat2" },
    { label: "Pending Invites", value: pending, sub: "Awaiting response", icon: Clock, variant: "stat3" },
  ];

  return (
    <ManagerLayout>
      {/* ── Page Header ── */}
      <div className="flex justify-between items-start mb-8 animate-fadeIn">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "var(--accent-subtle)", color: "var(--accent-text)" }}>
            <Users size={26} />
          </div>
          <div>
            <h1 className="t-primary text-2xl font-bold tracking-[-0.02em]">Employee Management</h1>
            <p className="t-muted text-sm mt-0.5">Manage employee invitations and onboarding.</p>
          </div>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? <><X size={15} /> Close</> : <><UserPlus size={15} /> Add Employee</>}
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-3 gap-5 mb-8">
        {stats.map(({ label, value, sub, icon: Icon, variant }, i) => (
          <div key={label} className="rounded-2xl p-5 animate-fadeIn hover:translate-y-[-2px] transition-all duration-300 cursor-default"
            style={{ background: `var(--stat-${i+1}-bg)`, border: `1px solid var(--stat-${i+1}-border)`, boxShadow: "var(--shadow-sm)", animationDelay: `${i*80}ms` }}>
            <div className="flex items-center gap-3 mb-3">
              <IconBox icon={Icon} variant={variant} className="w-10 h-10" size={18} />
              <span className="t-secondary text-sm font-medium">{label}</span>
            </div>
            <p className="text-3xl font-bold tracking-tight mb-0.5" style={{ color: `var(--stat-${i+1}-value)` }}>{value}</p>
            <p className="t-muted text-xs">{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Add Form (modal-like) ── */}
      {showForm && (
        <Card className="p-6 mb-6 max-w-lg animate-fadeIn" delay={80}>
          <h3 className="t-primary text-sm font-semibold mb-4">Invite New Employee</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="t-secondary text-xs font-semibold block mb-1.5">Full Name</label>
              <input type="text" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="Enter employee name" className="input-themed !resize-y" />
            </div>
            <div>
              <label className="t-secondary text-xs font-semibold block mb-1.5">Email Address</label>
              <input type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} placeholder="employee@company.com" className="input-themed !resize-y" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? <><Loader2 size={15} className="animate-spin" /> Sending...</> : <><Send size={15} /> Send Password Setup Link</>}
            </button>
          </form>
        </Card>
      )}

      {/* ── Employee Directory ── */}
      <Card className="overflow-hidden animate-fadeIn" delay={200}>
        {/* Directory Header */}
        <div className="px-6 py-5 flex justify-between items-center" style={{ borderBottom: "1px solid var(--border-color)" }}>
          <div>
            <h2 className="t-primary text-base font-semibold">Employee Directory</h2>
            <p className="t-muted text-xs mt-0.5">View all employees and invitation statuses.</p>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 t-muted" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search employees..."
              className="input-themed !w-[220px] !pl-9 !py-2 !text-xs !rounded-lg" />
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[2fr_2fr_1fr_1.2fr] px-6 py-3" style={{ background: "var(--bg-input)", borderBottom: "1px solid var(--border-color)" }}>
          {["Employee", "Email", "Status", "Action"].map(h => (
            <span key={h} className="t-muted text-[11px] uppercase tracking-wider font-semibold">{h}</span>
          ))}
        </div>

        {/* Rows */}
        {paged.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="t-muted text-sm">{search ? "No employees match your search" : "No employees added yet"}</p>
          </div>
        ) : (
          <div>
            {paged.map(emp => (
              <div key={emp._id} className="grid grid-cols-[2fr_2fr_1fr_1.2fr] items-center px-6 py-4 transition-colors hover:bg-[var(--bg-hover)]"
                style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                {/* Employee */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: getColor(emp.name) }}>
                    {emp.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="t-primary text-sm font-semibold leading-tight">{emp.name}</p>
                    <p className="text-[11px] font-medium px-1.5 py-0.5 rounded mt-0.5 inline-block"
                      style={{ background: "var(--accent-subtle)", color: "var(--accent-text)" }}>
                      Team Member
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-2">
                  <Mail size={13} className="t-muted shrink-0" />
                  <span className="t-accent text-sm font-medium truncate">{emp.email}</span>
                </div>

                {/* Status */}
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide"
                    style={emp.status === "active"
                      ? { background: "var(--status-fwd-bg)", color: "var(--status-fwd-text)" }
                      : { background: "var(--status-sent-bg)", color: "var(--status-sent-text)" }
                    }>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: emp.status === "active" ? "var(--status-fwd-dot)" : "var(--status-sent-dot)" }} />
                    {emp.status}
                  </span>
                </div>

                {/* Action */}
                <div>
                  {emp.status === "active" ? (
                    <span style={{ color: "var(--stat-3-accent)" }} className="text-sm font-semibold flex items-center gap-1.5">
                      <UserCheck size={14} /> Active Employee
                    </span>
                  ) : (
                    <button onClick={() => handleResend(emp)}
                      className="btn-secondary !py-2 !px-3 !text-xs !gap-1.5">
                      <RotateCcw size={12} /> Resend Invite
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="px-6 py-4 flex justify-between items-center" style={{ borderTop: "1px solid var(--border-color)" }}>
            <div className="flex items-center gap-1.5">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="btn-secondary !w-8 !h-8 !p-0 justify-center disabled:opacity-30">
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center ${page === p ? "text-white" : "t-muted hover:bg-[var(--bg-hover)]"}`}
                  style={page === p ? { background: "var(--accent)" } : {}}>
                  {p}
                </button>
              ))}
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                className="btn-secondary !w-8 !h-8 !p-0 justify-center disabled:opacity-30">
                <ChevronRight size={14} />
              </button>
            </div>
            <span className="t-muted text-xs font-medium">
              Showing {(page - 1) * PER_PAGE + 1} to {Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} employees
            </span>
          </div>
        )}
      </Card>
    </ManagerLayout>
  );
}

export default AddEmployee;
