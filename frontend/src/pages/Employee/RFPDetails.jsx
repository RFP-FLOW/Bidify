import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Employee/SidebarEmployee";
import { toast } from "react-toastify";
import SelectVendorsModal from "../../components/SelectVendorsModal";

function RFPDetails() {
  const { rfpId } = useParams();
  const [rfp, setRfp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchRFP = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `http://localhost:5000/api/rfp/${rfpId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        setRfp(res.data);
      } catch (error) {
        console.error("Failed to fetch RFP:", error);
        toast.error("Failed to load RFP details");
      } finally {
        setLoading(false);
      }
    };

    fetchRFP();
  }, [rfpId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading RFP details...
      </div>
    );
  }

  if (!rfp) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        RFP not found
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-50 min-h-screen">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {rfp.title}
            </h1>
            <span className="text-sm text-yellow-600 font-medium">
              {rfp.status}
            </span>
          </div>

          <div className="flex gap-3">
            <button className="px-4 py-2 border rounded hover:bg-gray-100">
              Check Emails
            </button>

            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Send to Vendors
            </button>
          </div>
        </div>

        {/* REQUIREMENTS */}
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="font-semibold mb-2">Requirements</h2>
          <p className="text-gray-700">
            {rfp.description || "No description provided"}
          </p>
        </div>

        {/* STRUCTURED DATA */}
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="font-semibold mb-2">Structured Data</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(
              {
                title: rfp.title,
                items: rfp.items,
                budget: rfp.budget || null,
                deadline: rfp.deadline || null,
                paymentTerms: rfp.paymentTerms || null,
                warranty: rfp.warranty || null,
              },
              null,
              2
            )}
          </pre>
        </div>

        {/* PROPOSALS EMPTY STATE */}
        <div className="bg-white p-8 rounded shadow text-center">
          <div className="flex flex-col items-center gap-3 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75M21.75 6.75A2.25 2.25 0 0019.5 4.5H4.5A2.25 2.25 0 002.25 6.75m19.5 0l-9.75 6.75L2.25 6.75"
              />
            </svg>

            <h3 className="text-lg font-medium text-gray-600">
              No proposals received yet
            </h3>

            <p className="text-sm text-gray-400">
              Proposals will appear here once vendors respond
            </p>
          </div>
        </div>
      </div>

      {/* ✅ MODAL MUST BE INSIDE RETURN */}
      <SelectVendorsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        vendors={[
          {
            _id: "1",
            name: "Dell Technologies",
            email: "dell@gmail.com",
          },
          {
            _id: "2",
            name: "Lenovo",
            email: "lenovo@gmail.com",
          },
          {
            _id: "3",
            name: "Thinkpad Solutions",
            email: "thinkpad@gmail.com",
          },
        ]}
      />
    </div>
  );
}

export default RFPDetails;
