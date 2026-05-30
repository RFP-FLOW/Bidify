import { useEffect, useState } from "react";
import api from "../../services/api";
import ManagerLayout from "../../components/Manager/SidebarCardManager";
import { Card, StatGrid, ManagerPageHeader, SearchInput, EmptyState, LoadingSkeleton } from "../../components/ui/Themed";
import { CheckCircle, ExternalLink, Truck, DollarSign } from "lucide-react";

const fmt = (n) => Number(n || 0).toLocaleString("en-IN");

const ConfirmedRFPs = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/rfp/confirmed")
      .then(res => setData(res.data.rfps || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = data.filter(r => !search || (r.title || "").toLowerCase().includes(search.toLowerCase()) || (r.vendorName || "").toLowerCase().includes(search.toLowerCase()));

  const totalCost = data.reduce((sum, r) => sum + Number(r.grandTotal || r.price || r.quotedPrice || 0), 0);

  return (
    <ManagerLayout>
      {/* ── Header ── */}
      <ManagerPageHeader
        icon={CheckCircle}
        title="Confirmed RFPs"
        subtitle="Finalized vendor selections approved by you."
      />

      {/* ── Stats ── */}
      <StatGrid stats={[
        { label: "Total Confirmed", value: data.length, sub: "Vendor approvals", icon: CheckCircle, variant: "stat1" },
        { label: "Total Cost", value: `₹${fmt(totalCost)}`, sub: "Combined value", icon: DollarSign, variant: "stat2" },
        { label: "Avg Delivery", value: `${data.length ? Math.round(data.reduce((s, r) => s + (r.deliveryDays || 0), 0) / data.length) : 0}d`, sub: "Average days", icon: Truck, variant: "stat3" },
      ]} />

      {/* ── Directory ── */}
      <Card className="overflow-hidden animate-fadeIn" delay={250}>
        <div className="px-6 py-5 flex justify-between items-center" style={{ borderBottom: "1px solid var(--border-color)" }}>
          <div>
            <h2 className="t-primary text-base font-semibold">Approved Procurements</h2>
            <p className="t-muted text-xs mt-0.5">All RFPs with finalized vendors.</p>
          </div>
          <SearchInput value={search} onChange={setSearch} placeholder="Search RFPs..." />
        </div>

        {loading && <LoadingSkeleton rows={3} cardHeight="h-20" />}

        {!loading && filtered.length === 0 && (
          <EmptyState
            icon={CheckCircle}
            title="No confirmed RFPs"
            subtitle={search ? "No results match your search" : "Approved vendors will appear here."}
          />
        )}

        {!loading && filtered.map((rfp, i) => (
          <div key={i} className="px-6 py-5 transition-colors hover:bg-[var(--bg-hover)]"
            style={{ borderBottom: "1px solid var(--border-subtle)" }}>
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                  style={{ background: "var(--stat-3-accent)" }}>
                  {(rfp.vendorName || "V").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="t-primary text-sm font-semibold">{rfp.title || "Procurement Request"}</p>
                  <p className="t-muted text-xs mt-0.5">Vendor: <span className="t-secondary font-medium">{rfp.vendorName}</span> · {rfp.vendorEmail}</p>
                </div>
              </div>
              <span className="px-3 py-1.5 rounded-full text-[11px] font-bold"
                style={{ background: "var(--status-fwd-bg)", color: "var(--status-fwd-text)" }}>
                ✓ APPROVED
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 ml-[52px]">
              <div className="rounded-lg px-3 py-2 bg-input b-subtle">
                <p className="t-muted text-[10px] uppercase tracking-wider font-semibold">Total Cost</p>
                <p className="text-sm font-bold mt-0.5" style={{ color: "var(--stat-3-accent)" }}>₹{fmt(rfp.grandTotal || rfp.price || rfp.quotedPrice)}</p>
              </div>
              <div className="rounded-lg px-3 py-2 bg-input b-subtle">
                <p className="t-muted text-[10px] uppercase tracking-wider font-semibond">Delivery</p>
                <p className="t-primary text-sm font-semibold mt-0.5">{rfp.deliveryDays || 0} days</p>
              </div>
              {rfp.attachment && (
                <div className="flex items-center">
                  <a href={rfp.attachment} target="_blank" rel="noopener noreferrer"
                    className="btn-secondary !py-2 !px-3 !text-xs !gap-1.5">
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