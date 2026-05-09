import { useEffect, useState } from "react";
import axios from "axios";
import ManagerLayout from "../../components/Manager/SidebarCardManager";
import { toast } from "react-toastify";
import { Card, IconBox, EmptyState, SectionLabel } from "../../components/ui/Themed";
import { BadgeCheck, ArrowLeft, Trophy, ExternalLink, Check, XCircle, Clock, Search, Package, Bot } from "lucide-react";

const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const fmt = (n) => Number(n || 0).toLocaleString("en-IN");
const dateStr = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });
const isCacheValid = (rfp) => rfp.aiRecommendationCache && rfp.aiRecommendationCachedAt && Date.now() - new Date(rfp.aiRecommendationCachedAt).getTime() < CACHE_TTL_MS;

function ManagerRecommendations() {
  const [rfps, setRfps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/rfp/forwarded", { headers: authHeader() })
      .then(res => setRfps(res.data.rfps || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (selected) return <ManagerLayout><DetailView rfp={selected} onBack={() => setSelected(null)} /></ManagerLayout>;

  const filtered = rfps.filter(r => !search || r.title.toLowerCase().includes(search.toLowerCase()) || (r.createdBy?.name || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <ManagerLayout>
      {/* ── Header ── */}
      <div className="flex justify-between items-start mb-8 animate-fadeIn">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "var(--accent-subtle)", color: "var(--accent-text)" }}>
            <BadgeCheck size={26} />
          </div>
          <div>
            <h1 className="t-primary text-2xl font-bold tracking-[-0.02em]">AI Recommendations</h1>
            <p className="t-muted text-sm mt-0.5">RFPs forwarded to you with AI vendor analysis.</p>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-5 mb-8">
        {[
          { label: "Total Forwarded", value: rfps.length, sub: "From employees", icon: BadgeCheck, variant: "stat1" },
          { label: "With AI Data", value: rfps.filter(r => isCacheValid(r)).length, sub: "Cached analysis", icon: Bot, variant: "stat2" },
          { label: "Pending Review", value: rfps.length, sub: "Awaiting decision", icon: Clock, variant: "stat3" },
        ].map(({ label, value, sub, icon: Icon, variant }, i) => (
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

      {/* ── Directory ── */}
      <Card className="overflow-hidden animate-fadeIn" delay={250}>
        <div className="px-6 py-5 flex justify-between items-center" style={{ borderBottom: "1px solid var(--border-color)" }}>
          <div>
            <h2 className="t-primary text-base font-semibold">Forwarded RFPs</h2>
            <p className="t-muted text-xs mt-0.5">Click to view detailed AI analysis.</p>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 t-muted" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search RFPs..." className="input-themed !w-[220px] !pl-9 !py-2 !text-xs !rounded-lg" />
          </div>
        </div>

        {loading && <div className="px-6 py-4 space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 rounded-xl animate-shimmer" />)}</div>}

        {!loading && filtered.length === 0 && (
          <div className="px-6 py-12 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{ background: "var(--accent-subtle)", color: "var(--accent-text)" }}>
              <BadgeCheck size={22} />
            </div>
            <p className="t-primary text-sm font-semibold mb-1">{search ? "No results" : "No recommendations yet"}</p>
            <p className="t-muted text-xs">Forwarded RFPs will appear here.</p>
          </div>
        )}

        {!loading && filtered.map(rfp => (
          <RFPRow key={rfp._id} rfp={rfp} onClick={() => setSelected(rfp)} />
        ))}
      </Card>
    </ManagerLayout>
  );
}

/* ── RFP Row (with inline AI preview) ── */
function RFPRow({ rfp, onClick }) {
  const [aiData, setAiData] = useState(isCacheValid(rfp) ? rfp.aiRecommendationCache : null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isCacheValid(rfp)) return;
    setRefreshing(true);
    axios.post(`http://localhost:5000/api/ai/recommend/${rfp._id}`, {}, { headers: authHeader() })
      .then(res => setAiData(res.data.recommendation))
      .catch(() => {})
      .finally(() => setRefreshing(false));
  }, [rfp._id]);

  const top2 = aiData?.topRecommendations?.slice(0, 2) || [];

  return (
    <div onClick={onClick} className="px-6 py-5 cursor-pointer transition-colors hover:bg-[var(--bg-hover)] group"
      style={{ borderBottom: "1px solid var(--border-subtle)" }}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: "var(--accent)" }}>
            {(rfp.title || "R").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="t-primary text-sm font-semibold group-hover:text-[var(--accent-text)] transition-colors">{rfp.title}</p>
            <p className="t-muted text-xs mt-0.5">By <span className="t-secondary font-medium">{rfp.createdBy?.name}</span> · {dateStr(rfp.updatedAt)}</p>
          </div>
        </div>
        <span className="px-3 py-1.5 rounded-full text-[11px] font-bold" style={{ background: "var(--status-fwd-bg)", color: "var(--status-fwd-text)" }}>FORWARDED</span>
      </div>

      {refreshing && <p className="t-muted text-xs ml-[52px]">Loading AI data...</p>}

      {top2.length > 0 && (
        <div className="flex gap-3 ml-[52px]">
          {top2.map((v, i) => (
            <div key={i} className="flex-1 rounded-lg px-3 py-2" style={{ background: i === 0 ? "var(--stat-3-accent-bg)" : "var(--bg-input)", borderLeft: `3px solid ${i === 0 ? "var(--stat-3-accent)" : "var(--border-color)"}` }}>
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: i === 0 ? "var(--stat-3-accent)" : "var(--text-muted)" }}>#{i+1} {i === 0 ? "Best" : ""}</p>
              <p className="t-primary text-xs font-semibold truncate">{v.vendor}</p>
              <p className="text-xs font-bold mt-0.5" style={{ color: i === 0 ? "var(--stat-3-accent)" : "var(--text-secondary)" }}>₹{fmt(v.grandTotal)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Detail View ── */
function DetailView({ rfp, onBack }) {
  const [aiData, setAiData] = useState(isCacheValid(rfp) ? rfp.aiRecommendationCache : null);
  const [loading, setLoading] = useState(!isCacheValid(rfp));
  const [approvedId, setApprovedId] = useState(null);

  useEffect(() => {
    if (isCacheValid(rfp)) return;
    setLoading(true);
    axios.post(`http://localhost:5000/api/ai/recommend/${rfp._id}`, {}, { headers: authHeader() })
      .then(res => setAiData(res.data.recommendation))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [rfp._id]);

  const handleApprove = async (proposalId) => {
    try {
      const res = await axios.patch(`http://localhost:5000/api/rfp/proposal/approve/${proposalId}`, {}, { headers: authHeader() });
      if (res.data.success) {
        setAiData(prev => ({ ...prev,
          topRecommendations: prev.topRecommendations.map(v => ({ ...v, status: v.proposalId === proposalId ? "ACCEPTED" : "REJECTED" })),
          vendorsAnalysis: prev.vendorsAnalysis.map(v => ({ ...v, status: v.proposalId === proposalId ? "ACCEPTED" : "REJECTED" })),
        }));
        setApprovedId(proposalId);
        toast.success("Vendor Approved ✅");
      } else toast.error(res.data.message);
    } catch { toast.error("Failed to approve vendor ❌"); }
  };

  const unique = []; const seen = new Set();
  (aiData?.topRecommendations || []).forEach(v => { if (!seen.has(v.email)) { seen.add(v.email); unique.push(v); } });
  const top3 = unique.slice(0, 3);
  const analysisMap = {}; aiData?.vendorsAnalysis?.forEach(v => { analysisMap[v.vendor] = v; });
  const rankBg = ["var(--stat-3-accent)", "var(--stat-2-accent)", "var(--stat-1-accent)"];

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium mb-6 t-accent hover:underline"><ArrowLeft size={14} /> Back to Recommendations</button>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8 animate-fadeIn">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "var(--accent-subtle)", color: "var(--accent-text)" }}>
          <Trophy size={26} />
        </div>
        <div>
          <h1 className="t-primary text-2xl font-bold tracking-[-0.02em]">{rfp.title}</h1>
          <p className="t-muted text-sm mt-0.5">By <span className="t-secondary font-medium">{rfp.createdBy?.name}</span> ({rfp.createdBy?.email})</p>
        </div>
      </div>

      {loading && <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-40 rounded-2xl animate-shimmer" />)}</div>}
      {!loading && top3.length === 0 && <EmptyState icon={BadgeCheck} title="No AI analysis available" subtitle="No data for this RFP" />}

      <div className="space-y-4">
        {top3.map((vendor, i) => {
          const a = analysisMap[vendor.vendor] || {};
          return (
            <Card key={i} className="p-5" style={{ borderLeft: `4px solid ${rankBg[i]}` }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ background: rankBg[i] }}>#{i+1}</span>
                  <div><p className="t-primary text-sm font-semibold">{vendor.vendor}</p><p className="t-muted text-xs">{vendor.email}</p></div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold" style={{ color: "var(--stat-3-accent)" }}>₹{fmt(vendor.grandTotal)}</p>
                  {vendor.deliveryDays !== undefined && <p className="t-muted text-xs">{vendor.deliveryDays} days</p>}
                  {vendor.status === "ACCEPTED" && <p style={{ color: "var(--stat-3-accent)" }} className="text-sm font-semibold mt-1">Approved ✅</p>}
                  {vendor.status === "REJECTED" && <p className="text-red-500 text-sm font-semibold mt-1">Rejected ❌</p>}
                </div>
              </div>

              {a.reason && <div className="mb-4 rounded-lg px-3 py-2 text-xs" style={{ background: "var(--stat-1-accent-bg)", color: "var(--stat-1-accent)", border: "1px solid var(--stat-1-border)" }}>💡 {a.reason}</div>}

              {a.itemBreakdown?.length > 0 && (
                <div className="overflow-x-auto mb-3 rounded-lg b-subtle">
                  <table className="w-full text-sm">
                    <thead><tr style={{ background: "var(--bg-input)" }}>
                      {["Item", "Qty", "Unit Price", "Total"].map(h => <th key={h} className={`t-muted text-[11px] uppercase tracking-wider font-semibold px-3 py-2 ${h === "Item" ? "text-left" : h === "Qty" ? "text-center" : "text-right"}`}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {a.itemBreakdown.map((item, idx) => (
                        <tr key={idx} style={{ borderTop: "1px solid var(--border-subtle)" }}>
                          <td className="t-secondary px-3 py-2">{item.item}</td>
                          <td className="t-secondary px-3 py-2 text-center">{item.quantity ?? "—"}</td>
                          <td className="t-secondary px-3 py-2 text-right">{item.unitPrice ? `₹${fmt(item.unitPrice)}` : "—"}</td>
                          <td className="t-primary px-3 py-2 text-right font-medium">₹{fmt(item.totalItemPrice)}</td>
                        </tr>
                      ))}
                      {a.deliveryCharge !== undefined && <tr style={{ borderTop: "1px solid var(--border-subtle)" }}><td colSpan={3} className="t-muted px-3 py-2 text-right text-xs">Delivery</td><td className="t-muted px-3 py-2 text-right text-xs">₹{fmt(a.deliveryCharge)}</td></tr>}
                      <tr style={{ borderTop: "2px solid var(--border-color)" }}><td colSpan={3} className="t-primary px-3 py-2 text-right font-bold text-sm">Grand total</td><td className="px-3 py-2 text-right font-bold text-sm" style={{ color: "var(--stat-3-accent)" }}>₹{fmt(a.grandTotal || vendor.grandTotal)}</td></tr>
                    </tbody>
                  </table>
                </div>
              )}

              {vendor.attachment && <a href={vendor.attachment} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-medium t-accent hover:underline mt-2"><ExternalLink size={12} /> View Proposal File</a>}

              {vendor.status === "PENDING" && (
                <button onClick={() => handleApprove(vendor.proposalId)} className="btn-primary mt-4" style={{ background: "var(--stat-3-accent)" }}>
                  <Check size={14} /> {approvedId === vendor.proposalId ? "Approved ✅" : "Approve Vendor"}
                </button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default ManagerRecommendations;
