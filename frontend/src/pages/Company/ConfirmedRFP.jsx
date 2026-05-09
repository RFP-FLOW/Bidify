import { useEffect, useState } from "react";
import axios from "axios";
import ManagerLayout from "../../components/Manager/SidebarCardManager";
import { Card, IconBox } from "../../components/ui/Themed";
import { CheckCircle, ExternalLink, Truck, DollarSign, Search, Package } from "lucide-react";

const fmt = (n) => Number(n || 0).toLocaleString("en-IN");

const ConfirmedRFPs = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/rfp/confirmed", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
      .then(res => setData(res.data.rfps || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = data.filter(r => !search || (r.title || "").toLowerCase().includes(search.toLowerCase()) || (r.vendorName || "").toLowerCase().includes(search.toLowerCase()));

  const totalCost = data.reduce((sum, r) => sum + Number(r.grandTotal || r.price || r.quotedPrice || 0), 0);

  const stats = [
    { label: "Total Confirmed", value: data.length, sub: "Vendor approvals", icon: CheckCircle, variant: "stat3" },
    { label: "Total Cost", value: `₹${fmt(totalCost)}`, sub: "Combined value", icon: DollarSign, variant: "stat1" },
    { label: "Avg Delivery", value: `${data.length ? Math.round(data.reduce((s, r) => s + (r.deliveryDays || 0), 0) / data.length) : 0}d`, sub: "Average days", icon: Truck, variant: "stat2" },
  ];

  return (
    <ManagerLayout>
      {/* ── Header ── */}
      <div className="flex justify-between items-start mb-8 animate-fadeIn">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "var(--accent-subtle)", color: "var(--accent-text)" }}>
            <CheckCircle size={26} />
          </div>
          <div>
            <h1 className="t-primary text-2xl font-bold tracking-[-0.02em]">Confirmed RFPs</h1>
            <p className="t-muted text-sm mt-0.5">Finalized vendor selections approved by you.</p>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-5 mb-8">
        {stats.map(({ label, value, sub, icon: Icon, variant }, i) => (
          <div key={label} className="rounded-2xl p-5 animate-fadeIn hover:translate-y-[-2px] transition-all duration-300 cursor-default"
            style={{ background: `var(--stat-${i+1}-bg)`, border: `1px solid var(--stat-${i+1}-border)`, boxShadow: "var(--shadow-sm)", animationDelay: `${i*80}ms` }}>
            <div className="flex items-center gap-3 mb-3">
              <IconBox icon={Icon} variant={variant} className="w-10 h-10" size={18} />
              <span className="t-secondary text-sm font-medium">{label}</span>
            </div>
            <p className="text-2xl font-bold tracking-tight mb-0.5" style={{ color: `var(--stat-${i+1}-value)` }}>{value}</p>
            <p className="t-muted text-xs">{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Directory ── */}
      <Card className="overflow-hidden animate-fadeIn" delay={250}>
        <div className="px-6 py-5 flex justify-between items-center" style={{ borderBottom: "1px solid var(--border-color)" }}>
          <div>
            <h2 className="t-primary text-base font-semibold">Approved Procurements</h2>
            <p className="t-muted text-xs mt-0.5">All RFPs with finalized vendors.</p>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 t-muted" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search RFPs..." className="input-themed !w-[220px] !pl-9 !py-2 !text-xs !rounded-lg" />
          </div>
        </div>

        {loading && <div className="px-6 py-4 space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 rounded-xl animate-shimmer" />)}</div>}

        {!loading && filtered.length === 0 && (
          <div className="px-6 py-12 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{ background: "var(--accent-subtle)", color: "var(--accent-text)" }}>
              <CheckCircle size={22} />
            </div>
            <p className="t-primary text-sm font-semibold mb-1">No confirmed RFPs</p>
            <p className="t-muted text-xs">{search ? "No results match your search" : "Approved vendors will appear here."}</p>
          </div>
        )}

        {!loading && filtered.map((rfp, i) => (
          <div key={i} className="px-6 py-5 transition-colors hover:bg-[var(--bg-hover)]" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: "var(--stat-3-accent)" }}>
                  {(rfp.vendorName || "V").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="t-primary text-sm font-semibold">{rfp.title || "Procurement Request"}</p>
                  <p className="t-muted text-xs mt-0.5">Vendor: <span className="t-secondary font-medium">{rfp.vendorName}</span> · {rfp.vendorEmail}</p>
                </div>
              </div>
              <span className="px-3 py-1.5 rounded-full text-[11px] font-bold" style={{ background: "var(--status-fwd-bg)", color: "var(--status-fwd-text)" }}>
                ✓ APPROVED
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 ml-[52px]">
              <div className="rounded-lg px-3 py-2 bg-input b-subtle">
                <p className="t-muted text-[10px] uppercase tracking-wider font-semibold">Total Cost</p>
                <p className="text-sm font-bold mt-0.5" style={{ color: "var(--stat-3-accent)" }}>₹{fmt(rfp.grandTotal || rfp.price || rfp.quotedPrice)}</p>
              </div>
              <div className="rounded-lg px-3 py-2 bg-input b-subtle">
                <p className="t-muted text-[10px] uppercase tracking-wider font-semibold">Delivery</p>
                <p className="t-primary text-sm font-semibold mt-0.5">{rfp.deliveryDays || 0} days</p>
              </div>
              {rfp.attachment && (
                <div className="flex items-center">
                  <a href={rfp.attachment} target="_blank" rel="noopener noreferrer" className="btn-secondary !py-2 !px-3 !text-xs !gap-1.5">
                    <ExternalLink size={12} /> View File
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </Card>
    </ManagerLayout>
  );
};

export default ConfirmedRFPs;