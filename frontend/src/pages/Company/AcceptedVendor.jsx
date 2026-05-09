import { useEffect, useState } from "react";
import ManagerLayout from "../../components/Manager/SidebarCardManager";
import { getAcceptedVendors } from "../../services/managerServices";
import { Card, IconBox } from "../../components/ui/Themed";
import { Users, Phone, MapPin, FileText, Search, Inbox, Mail } from "lucide-react";

function AcceptedVendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try { const res = await getAcceptedVendors(); setVendors(res.data.data || []); }
      catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = vendors.filter(v => !search || (v.businessName || "").toLowerCase().includes(search.toLowerCase()) || (v.name || "").toLowerCase().includes(search.toLowerCase()));

  const avatarColors = ["#4F46E5", "#0891B2", "#059669", "#D97706", "#DC2626", "#7C3AED"];
  const getColor = (n) => avatarColors[(n || "V").charCodeAt(0) % avatarColors.length];

  return (
    <ManagerLayout>
      {/* ── Header ── */}
      <div className="flex justify-between items-start mb-8 animate-fadeIn">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "var(--accent-subtle)", color: "var(--accent-text)" }}>
            <Inbox size={26} />
          </div>
          <div>
            <h1 className="t-primary text-2xl font-bold tracking-[-0.02em]">Vendor Directory</h1>
            <p className="t-muted text-sm mt-0.5">All approved vendors for your organization.</p>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-5 mb-8">
        {[
          { label: "Total Vendors", value: vendors.length, sub: "Approved vendors", icon: Users, variant: "stat1" },
          { label: "With Phone", value: vendors.filter(v => v.phone).length, sub: "Contact available", icon: Phone, variant: "stat2" },
          { label: "With GST", value: vendors.filter(v => v.gstNumber).length, sub: "GST registered", icon: FileText, variant: "stat3" },
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
            <h2 className="t-primary text-base font-semibold">Approved Vendors</h2>
            <p className="t-muted text-xs mt-0.5">View vendor details and contact information.</p>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 t-muted" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vendors..." className="input-themed !w-[220px] !pl-9 !py-2 !text-xs !rounded-lg" />
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[2fr_2fr_1.5fr_1fr] px-6 py-3" style={{ background: "var(--bg-input)", borderBottom: "1px solid var(--border-color)" }}>
          {["Vendor", "Contact", "GST Number", "Address"].map(h => (
            <span key={h} className="t-muted text-[11px] uppercase tracking-wider font-semibold">{h}</span>
          ))}
        </div>

        {loading && <div className="px-6 py-4 space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 rounded-xl animate-shimmer" />)}</div>}

        {!loading && filtered.length === 0 && (
          <div className="px-6 py-12 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{ background: "var(--accent-subtle)", color: "var(--accent-text)" }}>
              <Users size={22} />
            </div>
            <p className="t-primary text-sm font-semibold mb-1">{search ? "No results found" : "No approved vendors"}</p>
            <p className="t-muted text-xs">Vendors will appear here once approved.</p>
          </div>
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
