import { useEffect, useState } from "react";
import api from "../../services/api";
import ManagerLayout from "../../components/Manager/SidebarCardManager";
import VendorDetailsModal from "./VendorDetailsModal";
import { acceptRequest, getPendingRequests, rejectRequest } from "../../services/managerServices";
import { Card, IconBox, EmptyState, LoadingSkeleton, ManagerPageHeader, StatGrid } from "../../components/ui/Themed";
import { LayoutDashboard, CheckCircle, Users, Eye, Clock } from "lucide-react";

function ManagerDashboard() {
  const [vendorRequests, setVendorRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    forwardedRFPs: 0,
    confirmedRFPs: 0,
    pendingVendors: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes] = await Promise.all([
          api.get("/rfp/manager-stats"),
          fetchVendorRequests(),
        ]);

        setStats({
          forwardedRFPs: statsRes.data.forwardedRFPs,
          confirmedRFPs: statsRes.data.confirmedRFPs,
          pendingVendors: statsRes.data.pendingVendors,
        });

      } catch (e) {
        console.error(e);
      }
    };

    fetchDashboardData();
  }, []);

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

  const avatarColors = ["#4F46E5", "#0891B2", "#059669", "#D97706", "#DC2626", "#7C3AED"];
  const getColor = (n) => avatarColors[(n || "V").charCodeAt(0) % avatarColors.length];

  return (
    <ManagerLayout>
      {/* Header */}
      <ManagerPageHeader
        icon={LayoutDashboard}
        title={`Welcome, ${name} 👋`}
        subtitle="Manage vendor requests and RFP approvals."
      />

      {/* Stat Cards */}
      <StatGrid stats={[
        { label: "Pending Vendors", value: stats.pendingVendors, sub: "Waiting your approval", icon: Users, variant: "stat1" },
        { label: "Forwarded RFPs", value: stats.forwardedRFPs, sub: "Waiting your decision", icon: Clock, variant: "stat2" },
        { label: "Confirmed RFPs", value: stats.confirmedRFPs, sub: "Deals you approved", icon: CheckCircle, variant: "stat3" },
      ]} />

      {/* Vendor Requests */}
      <Card className="overflow-hidden animate-fadeIn" delay={250}>
        <div className="px-6 py-5 flex justify-between items-center"
          style={{ borderBottom: "1px solid var(--border-color)" }}>
          <div>
            <h2 className="t-primary text-base font-semibold">Vendor Approval Requests</h2>
            <p className="t-muted text-xs mt-0.5">Review and approve vendor registrations.</p>
          </div>
          <span className="px-3 py-1.5 rounded-full text-[11px] font-bold"
            style={{ background: "var(--stat-2-accent-bg)", color: "var(--stat-2-accent)" }}>
            {vendorRequests.length} pending
          </span>
        </div>

        {loading && <LoadingSkeleton rows={3} cardHeight="h-16" />}

        {!loading && vendorRequests.length === 0 && (
          <EmptyState
            icon={Users}
            title="No pending requests"
            subtitle="Vendor approval requests will appear here."
          />
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
                    <button
                      onClick={() => setSelectedRequest(req)}
                      className="btn-primary !py-2 !px-4 !text-xs">
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