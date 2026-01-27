import { useEffect, useState } from "react";
import VendorLayout from "../../components/Vendor-Sidebar/Layout";
import { getAllCompanies } from "../../services/companyService";
import api from "../../services/api";

const VendorDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [requestSent, setRequestSent] = useState(false);
  const checkRequestStatus = async (companyId) => {
  try {
    const res = await api.get(`/vendor/request-status/${companyId}`);
    setRequestSent(res.data.requested);
  } catch (err) {
    console.error(err);
  }
};

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await getAllCompanies();

        // 🔥 IMPORTANT FIX (array ensure)
        setCompanies(res.data.companies || res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCompanies();
  }, []);
  useEffect(() => {
    if (selectedCompany) {
      setRequestSent(false);
    }
  }, [selectedCompany]);
  const handleSendRequest = async () => {
    if (!selectedCompany) return;

    try {
      await api.post("/vendor/request", {
        companyId: selectedCompany._id,
      });

      setRequestSent(true); // ✅ IMPORTANT
      alert("Request sent successfully");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to send request");
    }
  };

  return (
    <VendorLayout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Welcome, Vendor 👋
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Discover companies & send collaboration requests
          </p>
        </div>

        <span className="text-xs bg-[#eef2ff] text-[#3a2d97] px-3 py-1 rounded-full">
          Vendor Panel
        </span>
      </div>

      {/* COMPANIES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {companies.map((company) => (
          <div
            key={company._id}
            onClick={() => {
  setSelectedCompany(company);
  checkRequestStatus(company._id);
}}
            className="bg-white border border-gray-200 rounded-xl p-6
                       cursor-pointer transition
                       hover:shadow-lg hover:-translate-y-1"
          >
            <h4 className="text-lg font-semibold text-gray-900">
              {company.companyName}
            </h4>
            <p className="text-sm text-gray-600 mt-2 line-clamp-3">
              {company.description || "No description available"}
            </p>

            <div className="mt-4 flex justify-between items-center">
              <span className="text-xs text-gray-400">
                {company.address || "—"}
              </span>

              <span className="text-sm text-[#3a2d97] font-medium">View →</span>
            </div>
          </div>
        ))}
      </div>

      {/* ================= MODAL ================= */}
      {selectedCompany && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-[420px]">
            <h3 className="text-xl font-semibold">
              {selectedCompany.companyName}
            </h3>

            <p className="text-sm text-gray-600 mt-2">
              {selectedCompany.description}
            </p>

            <p className="text-xs text-gray-400 mt-2">
              {selectedCompany.address}
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setSelectedCompany(null)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>

              <button
                onClick={handleSendRequest}
                disabled={requestSent}
                className={`px-4 py-2 rounded-md text-white
    ${requestSent ? "bg-gray-400 cursor-not-allowed" : "bg-[#3a2d97]"}`}
              >
                {requestSent ? "Request Sent" : "Send Request"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================== */}
    </VendorLayout>
  );
};

export default VendorDashboard;
