import { useEffect, useState } from "react";
import ManagerLayout from "../../components/Manager/SidebarCardManager";
import { getAcceptedVendors } from "../../services/managerServices";
import VendorCard from "../../components/Manager/VendorCard";

function AcceptedVendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAcceptedVendors();
  }, []);

  const fetchAcceptedVendors = async () => {
    try {
      const res = await getAcceptedVendors();
      setVendors(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch accepted vendors", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ManagerLayout>
      <div className="min-h-screen bg-[#fff5d7] p-8">

        <h2 className="text-2xl font-semibold mb-6">
          Approved Vendors
        </h2>

        {loading && (
          <p className="text-gray-500">Loading vendors...</p>
        )}

        {!loading && vendors.length === 0 && (
          <p className="text-gray-500">
            No approved vendors yet
          </p>
        )}

        {/* GRID: 2 CARDS PER ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vendors.map((vendor) => (
            <VendorCard key={vendor._id} vendor={vendor} />
          ))}
        </div>

      </div>
    </ManagerLayout>
  );
}

export default AcceptedVendors;
