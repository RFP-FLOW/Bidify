import { useEffect, useState } from "react";
import axios from "axios";  // ← ADDED ✅
import ManagerLayout from "../../components/Manager/SidebarCardManager";
import VendorDetailsModal from "./VendorDetailsModal";
import { acceptRequest, getPendingRequests, rejectRequest } from "../../services/managerServices";
import { Card, IconBox } from "../../components/ui/Themed";
import { LayoutDashboard, FileText, CheckCircle, Users, Eye, Clock } from "lucide-react";

function ManagerDashboard() {
  const [vendorRequests, setVendorRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeRFPs: 0,
    confirmedRFPs: 0,
    pendingVendors: 0
  });

  // ✅ merged + async/await + Promise.all
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        // run both simultaneously ✅
        const [statsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/rfp/manager-stats", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetchVendorRequests(),
        ]);

        setStats({
          activeRFPs: statsRes.data.activeRFPs,
          confirmedRFPs: statsRes.data.confirmedRFPs,
          pendingVendors: statsRes.data.pendingVendors,
        });

      } catch (e) {
        console.error(e);
      }
    };

    fetchDashboardData();
  }, []); // ← runs once on mount

  const fetchVendorRequests = async () => {
    try {
      const res = await getPendingRequests();
      setVendorRequests(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    await acceptRequest(id);
    setVendorRequests(prev => prev.filter(r => r._id !== id));
    setSelectedRequest(null);
  };

  const handleReject = async (id) => {
    await rejectRequest(id);
    setVendorRequests(prev => prev.filter(r => r._id !== id));
    setSelectedRequest(null);
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const name = user?.name || user?.username || user?.companyName || "Manager";

  // ✅ renamed to stats_cards — no conflict with stats state
  const stats_cards = [
    {
      label: "Active RFPs",
      value: stats.activeRFPs,
      sub: "Currently in progress",
      icon: FileText,
      variant: "stat1"
    },
    {
      label: "Pending Vendors",
      value: stats.pendingVendors,
      sub: "Awaiting your approval",
      icon: Clock,
      variant: "stat2"
    },
    {
      label: "Confirmed RFPs",
      value: stats.confirmedRFPs,
      sub: "Vendors approved",
      icon: CheckCircle,
      variant: "stat3"
    },
  ];

  const avatarColors = ["#4F46E5", "#0891B2", "#059669", "#D97706", "#DC2626", "#7C3AED"];
  const getColor = (n) => avatarColors[(n || "V").charCodeAt(0) % avatarColors.length];

  return (
    <ManagerLayout>
      {/* Header */}
      <div className="flex justify-between items-start mb-8 animate-fadeIn">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: "var(--accent-subtle)", color: "var(--accent-text)" }}>
            <LayoutDashboard size={26} />
          </div>
          <div>
            <h1 className="t-primary text-2xl font-bold tracking-[-0.02em]">
              Welcome, {name} 👋
            </h1>
            <p className="t-muted text-sm mt-0.5">
              Manage vendor requests and RFP approvals.
            </p>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-5 mb-8">
        {stats_cards.map(({ label, value, sub, icon: Icon, variant }, i) => (
          // ✅ stats_cards.map not stats.map
          <div key={label}
            className="rounded-2xl p-5 animate-fadeIn hover:translate-y-[-2px] transition-all duration-300 cursor-default"
            style={{
              background: `var(--stat-${i+1}-bg)`,
              border: `1px solid var(--stat-${i+1}-border)`,
              boxShadow: "var(--shadow-sm)",
              animationDelay: `${i*80}ms`
            }}>
            <div className="flex items-center gap-3 mb-3">
              <IconBox icon={Icon} variant={variant} className="w-10 h-10" size={18} />
              <span className="t-secondary text-sm font-medium">{label}</span>
            </div>
            <p className="text-3xl font-bold tracking-tight mb-0.5"
              style={{ color: `var(--stat-${i+1}-value)` }}>
              {value}
            </p>
            <p className="t-muted text-xs">{sub}</p>
          </div>
        ))}
      </div>

      {/* Vendor Requests */}
      <Card className="overflow-hidden animate-fadeIn" delay={250}>
        <div className="px-6 py-5 flex justify-between items-center"
          style={{ borderBottom: "1px solid var(--border-color)" }}>
          <div>
            <h2 className="t-primary text-base font-semibold">
              Vendor Approval Requests
            </h2>
            <p className="t-muted text-xs mt-0.5">
              Review and approve vendor registrations.
            </p>
          </div>
          <span className="px-3 py-1.5 rounded-full text-[11px] font-bold"
            style={{ background: "var(--stat-2-accent-bg)", color: "var(--stat-2-accent)" }}>
            {vendorRequests.length} pending
          </span>
        </div>

        {loading && (
          <div className="px-6 py-4 space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="h-16 rounded-xl animate-shimmer" />
            ))}
          </div>
        )}

        {!loading && vendorRequests.length === 0 && (
          <div className="px-6 py-12 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center"
              style={{ background: "var(--accent-subtle)", color: "var(--accent-text)" }}>
              <Users size={22} />
            </div>
            <p className="t-primary text-sm font-semibold mb-1">No pending requests</p>
            <p className="t-muted text-xs">Vendor approval requests will appear here.</p>
          </div>
        )}

        {!loading && vendorRequests.length > 0 && (
          <div>
            {vendorRequests.map(req => {
              const vName = req.vendorId?.businessName || req.vendorId?.name || "Vendor";
              return (
                <div key={req._id}
                  className="grid grid-cols-[2fr_2fr_1fr] items-center px-6 py-4 transition-colors hover:bg-[var(--bg-hover)]"
                  style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                      style={{ background: getColor(vName) }}>
                      {vName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="t-primary text-sm font-semibold">{vName}</p>
                      <p className="t-muted text-xs">{req.vendorId?.email || ""}</p>
                    </div>
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide"
                      style={{ background: "var(--status-sent-bg)", color: "var(--status-sent-text)" }}>
                      <Clock size={10} /> Pending
                    </span>
                  </div>
                  <div className="flex justify-end">
                    <button onClick={() => setSelectedRequest(req)} className="btn-primary !py-2 !px-4 !text-xs">
                      <Eye size={13} /> View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {selectedRequest && (
        <VendorDetailsModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </ManagerLayout>
  );
}

export default ManagerDashboard;