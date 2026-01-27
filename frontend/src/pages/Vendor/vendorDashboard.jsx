import { useEffect, useState } from "react";
import VendorLayout from "../../components/Vendor-Sidebar/Layout";
import { getVendorStats } from "../../services/vendorService";
import StatCard from "../../components/Vendor-Sidebar/StatCard";

const VendorDashboard = () => {
  const [stats, setStats] = useState({
    pending: 0,
    replied: 0,
    accepted: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getVendorStats();
        setStats({
          pending: res.data.pending || 0,
          replied: res.data.replied || 0,
          accepted: res.data.accepted || 0,
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, []);

  return (
    <VendorLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          Welcome, Vendor 👋
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Here’s what’s happening today
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Pending Requests" value={stats.pending} />
        <StatCard title="Replied" value={stats.replied} />
        <StatCard title="Accepted" value={stats.accepted} />
      </div>

      {/* LIST */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-5 border-b border-gray-200">
          <h3 className="font-medium text-gray-900">
            Recent RFPs
          </h3>
        </div>
      </div>
    </VendorLayout>
  );
};

export default VendorDashboard;
