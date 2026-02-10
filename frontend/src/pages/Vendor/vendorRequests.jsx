import { useEffect, useState } from "react";
import VendorLayout from "../../components/Vendor/Layout";
import api from "../../services/api";

const VendorRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get("/vendor-company/requests");
        setRequests(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) {
    return (
      <VendorLayout>
        <p className="text-gray-500">Loading requests...</p>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout>
      <h2 className="text-2xl font-semibold mb-6">
        My Company Requests
      </h2>

      {requests.length === 0 ? (
        <p className="text-gray-500">
          You haven’t sent any requests yet.
        </p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-white border rounded-xl p-4 flex justify-between items-center"
            >
              {/* COMPANY INFO */}
              <div>
                <h4 className="text-lg font-medium">
                  {req.companyId?.companyName}
                </h4>
                <p className="text-sm text-gray-500">
                  Request ID: {req._id}
                </p>
              </div>

              {/* STATUS BADGE */}
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold
                  ${
                    req.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : req.status === "APPROVED"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
              >
                {req.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </VendorLayout>
  );
};

export default VendorRequests;
