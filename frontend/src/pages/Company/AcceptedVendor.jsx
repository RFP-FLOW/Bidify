import { useEffect, useState } from "react";
import ManagerLayout from "../../components/Manager/SidebarCardManager";
import { getAcceptedVendors } from "../../services/managerServices";
import { Card, EmptyState, LoadingSkeleton, SearchInput, ManagerPageHeader, StatGrid } from "../../components/ui/Themed";
import { Users, Phone, MapPin, FileText, Search, Inbox, Mail } from "lucide-react";

function AcceptedVendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try { 
        const res = await getAcceptedVendors(); 
        setVendors(res.data.data || []); 
      }catch (e) { 
        console.error(e); 
      }finally {
         setLoading(false); } 
    })();
  }, []);

  const filtered = vendors.filter(v => !search || (v.businessName || "").toLowerCase().includes(search.toLowerCase()) || (v.name || "").toLowerCase().includes(search.toLowerCase()));

  const avatarColors = ["#4F46E5", "#0891B2", "#059669", "#D97706", "#DC2626", "#7C3AED"];
  const getColor = (n) => avatarColors[(n || "V").charCodeAt(0) % avatarColors.length];

  return (
    <ManagerLayout>
      {/* ── Header ── */}
      <ManagerPageHeader
        icon={Inbox}
        title="Vendor Directory"
        subtitle="All approved vendors for your organization."
      />

      {/* ── Stats ── */}
      <StatGrid stats={[
        { label: "Total Vendors", value: vendors.length, sub: "Approved vendors", icon: Users, variant: "stat1" },
        { label: "With Phone", value: vendors.filter(v => v.phone).length, sub: "Contact available", icon: Phone, variant: "stat2" },
        { label: "With GST", value: vendors.filter(v => v.gstNumber).length, sub: "GST registered", icon: FileText, variant: "stat3" },
      ]} />

      {/* ── Directory ── */}
      <Card className="overflow-hidden animate-fadeIn" delay={250}>
        <div className="px-6 py-5 flex justify-between items-center" style={{ borderBottom: "1px solid var(--border-color)" }}>
          <div>
            <h2 className="t-primary text-base font-semibold">Approved Vendors</h2>
            <p className="t-muted text-xs mt-0.5">View vendor details and contact information.</p>
          </div>
          <SearchInput value={search} onChange={setSearch} placeholder="Search vendors..." />
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[2fr_2fr_1.5fr_1fr] px-6 py-3" style={{ background: "var(--bg-input)", borderBottom: "1px solid var(--border-color)" }}>
          {["Vendor", "Contact", "GST Number", "Address"].map(h => (
            <span key={h} className="t-muted text-[11px] uppercase tracking-wider font-semibold">{h}</span>
          ))}
        </div>

        {loading && <LoadingSkeleton rows={3} cardHeight="h-16" />}

        {!loading && filtered.length === 0 && (
          <EmptyState icon={Users} title={search ? "No results found" : "No approved vendors"}
            subtitle="Vendors will appear here once approved." />
        )}

        {!loading && filtered.map(vendor => (
          <div key={vendor._id} className="grid grid-cols-[2fr_2fr_1.5fr_1fr] items-center px-6 py-4 transition-colors hover:bg-[var(--bg-hover)]"
            style={{ borderBottom: "1px solid var(--border-subtle)" }}>
            {/* Vendor */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: getColor(vendor.businessName || vendor.name) }}>
                {(vendor.businessName || "V").charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="t-primary text-sm font-semibold truncate">{vendor.businessName || "—"}</p>
                <p className="text-[11px] font-medium t-muted">Owner: {vendor.name}</p>
              </div>
            </div>
            {/* Contact */}
            <div className="space-y-1">
              <p className="flex items-center gap-1.5 text-xs"><Mail size={11} className="t-muted" /><span className="t-accent truncate">{vendor.email}</span></p>
              <p className="flex items-center gap-1.5 text-xs"><Phone size={11} className="t-muted" /><span className="t-secondary">{vendor.phone || "—"}</span></p>
            </div>
            {/* GST */}
            <div>
              {vendor.gstNumber
                ? <span className="px-2.5 py-1 text-[11px] font-mono font-medium rounded-md" style={{ background: "var(--accent-subtle)", color: "var(--accent-text)" }}>{vendor.gstNumber}</span>
                : <span className="t-muted text-xs">—</span>
              }
            </div>
            {/* Address */}
            <p className="t-muted text-xs truncate">{vendor.address || "—"}</p>
          </div>
        ))}
      </Card>
    </ManagerLayout>
  );
}

export default AcceptedVendors;
