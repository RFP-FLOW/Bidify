import ManagerLayout  from "../../components/Manager-Sidebar/SidebarCardManager";
import { useEffect, useState } from "react";
import VendorDetailsModal from "./VendorDetailsModal";
import { acceptRequest, getPendingRequests, rejectRequest } from "../../services/managerServices";

function ManagerDashboard() {
 
    const [vendorRequests, setVendorRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
  
     useEffect(() => {
    fetchVendorRequests();
    
  }, []);

  const fetchVendorRequests = async () => {
    const res = await getPendingRequests();
    setVendorRequests(res.data.data);
  };

  const handleApprove = async (id) => {
    await acceptRequest(id);
    setVendorRequests((prev) =>
      prev.filter((req) => req._id !== id)
    );
    setSelectedRequest(null);
  };

  const handleReject = async (id) => {
    await rejectRequest(id);
    setVendorRequests((prev) =>
      prev.filter((req) => req._id !== id)
    );
    setSelectedRequest(null);
  };

    return (
    <ManagerLayout>
    <div className="min-h-screen bg-[#fff5d7] flex">

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            Welcome, Manager <span>👋</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Here’s what’s happening in your company today
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StatCard title="Active RFPs" value="6" />
          <StatCard title="Confirmed RFPs" value="2" />
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-5 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">
              Recent Vendor Requests
            </h3>
          </div>

          
            <table className="w-full text-sm">
              <tbody>
                {vendorRequests.length === 0 && (
                  <tr>
                    <td className="px-5 py-6 text-center text-gray-400">
                      No pending vendor requests
                    </td>
                  </tr>
                )}

                {vendorRequests.map((req) => (
                  <tr
                    key={req._id}
                    className="border-t border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-5 py-4">
                     {req.vendorId?.businessName || req.vendorId?.name || "Vendor"}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setSelectedRequest(req)}
                        className="px-4 py-1.5 rounded-md bg-[#3a2d97] text-white text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

        </div>
      </main>
    </div>
     
       {/* MODAL */}
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


function StatCard({ title, value }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-semibold text-gray-900 mt-1">
        {value}
      </p>
    </div>
  );
}

export default ManagerDashboard;
