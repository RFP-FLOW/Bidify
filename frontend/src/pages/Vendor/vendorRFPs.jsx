import { useEffect, useState } from "react";
import API from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import VendorLayout from "../../components/Vendor/Layout";
import ReplyModal from "../../components/Vendor/ReplyModal";
import { Card, IconBox, EmptyState } from "../../components/ui/Themed";
import { FileText, Search, Package, Send } from "lucide-react";

function VendorRFPs() {
  const [rfps, setRfps] = useState([]);
  const [openReply, setOpenReply] = useState(false);
  const [selectedRfpId, setSelectedRfpId] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchRFPs = async () => {

  try {

    const res = await API.get(
      "/vendor-reply/open-rfps"
    );

    setRfps(res.data.data);

  } catch (e) {

    console.error(e);

  }
};

  useEffect(() => { fetchRFPs(); }, []);

  const filtered = rfps.filter(r => !search || r.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <VendorLayout>
      {/* Header */}
      <div className="flex justify-between items-start mb-8 animate-fadeIn">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "var(--accent-subtle)", color: "var(--accent-text)" }}><FileText size={26} /></div>
          <div><h1 className="t-primary text-2xl font-bold tracking-[-0.02em]">Open RFPs</h1><p className="t-muted text-sm mt-0.5">Requests sent by companies awaiting your proposal.</p></div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-5 mb-8">
        {[
          { label: "Total Open", value: rfps.length, sub: "Available RFPs", icon: FileText, variant: "stat1" },
          { label: "Replied", value: rfps.filter(r => r.hasVendorReplied).length, sub: "Proposals sent", icon: Send, variant: "stat2" },
          { label: "Pending Reply", value: rfps.filter(r => !r.hasVendorReplied).length, sub: "Awaiting your bid", icon: Package, variant: "stat3" },
        ].map(({ label, value, sub, icon: Icon, variant }, i) => (
          <div key={label} className="rounded-2xl p-5 animate-fadeIn hover:translate-y-[-2px] transition-all duration-300 cursor-default"
            style={{ background: `var(--stat-${i+1}-bg)`, border: `1px solid var(--stat-${i+1}-border)`, boxShadow: "var(--shadow-sm)", animationDelay: `${i*80}ms` }}>
            <div className="flex items-center gap-3 mb-3"><IconBox icon={Icon} variant={variant} className="w-10 h-10" size={18} /><span className="t-secondary text-sm font-medium">{label}</span></div>
            <p className="text-3xl font-bold tracking-tight mb-0.5" style={{ color: `var(--stat-${i+1}-value)` }}>{value}</p>
            <p className="t-muted text-xs">{sub}</p>
          </div>
        ))}
      </div>

      {/* Directory */}
      <Card className="overflow-hidden animate-fadeIn" delay={250}>
        <div className="px-6 py-5 flex justify-between items-center" style={{ borderBottom: "1px solid var(--border-color)" }}>
          <div><h2 className="t-primary text-base font-semibold">RFP Listings</h2><p className="t-muted text-xs mt-0.5">Review requirements and submit your bid.</p></div>
          <div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 t-muted" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search RFPs..." className="input-themed !w-[220px] !pl-9 !py-2 !text-xs !rounded-lg" /></div>
        </div>

        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center"><div className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{ background: "var(--accent-subtle)", color: "var(--accent-text)" }}><FileText size={22} /></div><p className="t-primary text-sm font-semibold mb-1">No RFPs available</p><p className="t-muted text-xs">Check back later for new requests.</p></div>
        ) : filtered.map(rfp => (
          <div key={rfp._id} className="px-6 py-5 transition-colors hover:bg-[var(--bg-hover)]" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
            <div className="flex justify-between items-start mb-3">
              <div><p className="t-primary text-sm font-semibold">{rfp.title}</p><p className="t-muted text-xs mt-0.5">{rfp.companyId?.companyName || "Company"}</p></div>
              <span className="px-3 py-1.5 rounded-full text-[11px] font-bold" style={rfp.hasVendorReplied ? { background: "var(--status-fwd-bg)", color: "var(--status-fwd-text)" } : { background: "var(--status-sent-bg)", color: "var(--status-sent-text)" }}>
                {rfp.hasVendorReplied ? "REPLIED" : "OPEN"}
              </span>
            </div>
            {rfp.description && <p className="t-muted text-xs mb-3 leading-relaxed line-clamp-2">{rfp.description}</p>}
            {rfp.items?.length > 0 && (
              <div className="mb-3 space-y-1">
                {rfp.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center rounded-lg px-3 py-1.5 text-xs bg-input b-subtle">
                    <div><span className="t-primary font-medium">{item.name}</span>{item.specification && <span className="t-muted ml-2">({item.specification})</span>}</div>
                    <span className="t-secondary font-semibold">× {item.quantity}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end">
              <button disabled={rfp.hasVendorReplied} onClick={() => { setSelectedRfpId(rfp._id); setOpenReply(true); }}
                className={`btn-primary !py-2 !px-4 !text-xs ${rfp.hasVendorReplied ? "opacity-50 cursor-not-allowed" : ""}`}>
                <Send size={12} /> {rfp.hasVendorReplied ? "Replied" : "Reply"}
              </button>
            </div>
          </div>
        ))}
      </Card>

      <ReplyModal open={openReply} rfpId={selectedRfpId} onClose={() => setOpenReply(false)} onSuccess={fetchRFPs} />
    </VendorLayout>
  );
}

export default VendorRFPs;
