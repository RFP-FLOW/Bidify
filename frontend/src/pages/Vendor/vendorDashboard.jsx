import { useEffect, useState } from "react";
import VendorLayout from "../../components/Vendor/Layout";
import { getAllCompanies } from "../../services/companyService";
import api from "../../services/api";
import { Card, IconBox, EmptyState } from "../../components/ui/Themed";
import { LayoutDashboard, Building2, Send, Search, X, Eye } from "lucide-react";

const VendorDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [requestSent, setRequestSent] = useState(false);
  const [search, setSearch] = useState("");

  const checkRequestStatus = async (companyId) => {
    try { const res = await api.get(`/vendor-company/request-status/${companyId}`); setRequestSent(res.data.requested); }
    catch (err) { console.error(err); }
  };

  useEffect(() => {
    (async () => { try { const res = await getAllCompanies(); setCompanies(res.data.companies || res.data); } catch (e) { console.error(e); } })();
  }, []);

  const handleSendRequest = async () => {
    if (!selectedCompany) return;
    try { await api.post("/vendor-company/request", { companyId: selectedCompany._id }); setRequestSent(true); }
    catch (err) { alert(err.response?.data?.message || "Failed to send request"); }
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const name = user?.name || user?.businessName || "Vendor";
  const filtered = companies.filter(c => !search || (c.companyName || "").toLowerCase().includes(search.toLowerCase()));

  const avatarColors = ["#4F46E5", "#0891B2", "#059669", "#D97706", "#DC2626", "#7C3AED"];
  const getColor = (n) => avatarColors[(n || "C").charCodeAt(0) % avatarColors.length];

  return (
    <VendorLayout>
      {/* Header */}
      <div className="flex justify-between items-start mb-8 animate-fadeIn">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "var(--accent-subtle)", color: "var(--accent-text)" }}><LayoutDashboard size={26} /></div>
          <div>
            <h1 className="t-primary text-2xl font-bold tracking-[-0.02em]">Welcome, {name} 👋</h1>
            <p className="t-muted text-sm mt-0.5">Discover companies & send collaboration requests.</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-5 mb-8">
        {[
          { label: "Companies", value: companies.length, sub: "Available to connect", icon: Building2, variant: "stat1" },
          { label: "Requests Sent", value: "—", sub: "Pending approvals", icon: Send, variant: "stat2" },
          { label: "Active Contracts", value: "—", sub: "Won proposals", icon: LayoutDashboard, variant: "stat3" },
        ].map(({ label, value, sub, icon: Icon, variant }, i) => (
          <div key={label} className="rounded-2xl p-5 animate-fadeIn hover:translate-y-[-2px] transition-all duration-300 cursor-default"
            style={{ background: `var(--stat-${i+1}-bg)`, border: `1px solid var(--stat-${i+1}-border)`, boxShadow: "var(--shadow-sm)", animationDelay: `${i*80}ms` }}>
            <div className="flex items-center gap-3 mb-3"><IconBox icon={Icon} variant={variant} className="w-10 h-10" size={18} /><span className="t-secondary text-sm font-medium">{label}</span></div>
            <p className="text-3xl font-bold tracking-tight mb-0.5" style={{ color: `var(--stat-${i+1}-value)` }}>{value}</p>
            <p className="t-muted text-xs">{sub}</p>
          </div>
        ))}
      </div>

      {/* Company Directory */}
      <Card className="overflow-hidden animate-fadeIn" delay={250}>
        <div className="px-6 py-5 flex justify-between items-center" style={{ borderBottom: "1px solid var(--border-color)" }}>
          <div><h2 className="t-primary text-base font-semibold">Company Directory</h2><p className="t-muted text-xs mt-0.5">Click a company to view details & send request.</p></div>
          <div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 t-muted" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search companies..." className="input-themed !w-[220px] !pl-9 !py-2 !text-xs !rounded-lg" /></div>
        </div>

        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center"><div className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{ background: "var(--accent-subtle)", color: "var(--accent-text)" }}><Building2 size={22} /></div><p className="t-primary text-sm font-semibold mb-1">No companies found</p><p className="t-muted text-xs">Try a different search term.</p></div>
        ) : filtered.map(company => (
          <div key={company._id} onClick={() => { setSelectedCompany(company); checkRequestStatus(company._id); }}
            className="px-6 py-4 flex items-center justify-between cursor-pointer transition-colors hover:bg-[var(--bg-hover)] group" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: getColor(company.companyName) }}>{(company.companyName || "C").charAt(0)}</div>
              <div><p className="t-primary text-sm font-semibold group-hover:text-[var(--accent-text)] transition-colors">{company.companyName}</p><p className="t-muted text-xs mt-0.5 line-clamp-1">{company.description || "No description"}</p></div>
            </div>
            <span className="t-muted text-xs">{company.address || "—"}</span>
          </div>
        ))}
      </Card>

      {/* Modal */}
      {selectedCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0" style={{ background: "var(--bg-overlay)" }} onClick={() => setSelectedCompany(null)} />
          <div className="relative z-10 w-[420px] card p-6 animate-scaleIn">
            <div className="flex justify-between items-start mb-5">
              <div><h2 className="t-primary text-base font-semibold">{selectedCompany.companyName}</h2><p className="t-muted text-xs mt-0.5">{selectedCompany.address || "—"}</p></div>
              <button onClick={() => setSelectedCompany(null)} className="w-7 h-7 rounded-md flex items-center justify-center t-muted bg-elevated"><X size={14} /></button>
            </div>
            <p className="t-secondary text-sm leading-relaxed mb-6">{selectedCompany.description || "No description available"}</p>
            <div className="flex justify-end gap-3 pt-4 bt-default">
              <button onClick={() => setSelectedCompany(null)} className="btn-secondary">Back</button>
              <button onClick={handleSendRequest} disabled={requestSent} className={`btn-primary ${requestSent ? "opacity-50 cursor-not-allowed" : ""}`}>
                <Send size={14} /> {requestSent ? "Request Sent" : "Send Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </VendorLayout>
  );
};

export default VendorDashboard;
