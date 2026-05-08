import { useEffect, useState } from "react";
import axios from "axios";
import ManagerLayout from "../../components/Manager/SidebarCardManager";

const ConfirmedRFPs = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/rfp/confirmed", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setData(res.data.rfps))
      .catch((err) => console.error("Error:", err));
  }, []);

  return (
    <ManagerLayout>
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Confirmed RFPs
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Finalized vendor selections approved by you
        </p>
      </div>

      {/* EMPTY STATE */}
      {data.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <p className="text-gray-400 text-sm">
            No confirmed RFPs yet
          </p>
        </div>
      )}

      {/* CARDS */}
      <div className="space-y-5">
        {data.map((rfp, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 border-l-4 border-green-500 hover:shadow-md transition"
          >
            {/* TOP */}
            <div className="flex justify-between items-start">
              <div>
               <h2 className="text-lg font-semibold text-gray-800">
  {rfp.title || "Procurement Request"}
</h2>

                <p className="text-xs text-gray-400 mt-1">
                  Approved Vendor
                </p>

                <p className="text-sm font-medium text-gray-700 mt-1">
                  {rfp.vendorName}
                </p>

                <p className="text-xs text-gray-400">
                  {rfp.vendorEmail}
                </p>
              </div>

              {/* STATUS BADGE */}
              <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
                APPROVED
              </span>
            </div>

            {/* DIVIDER */}
            <div className="border-t border-gray-100 my-4"></div>

            {/* BOTTOM */}
            <div className="flex justify-between items-center">
            <div>
  <p className="text-xs text-gray-400">
    Total Cost
  </p>

  <p className="text-xl font-bold text-green-600">
    ₹{Number(
      rfp.grandTotal ||
      rfp.price ||
      rfp.quotedPrice ||
      0
    ).toLocaleString("en-IN")}
  </p>
</div>

              <div className="text-right">
                <p className="text-xs text-gray-400">Delivery</p>
                <p className="text-sm font-medium text-gray-700">
                  {rfp.deliveryDays || 0} days
                </p>
              </div>
            </div>

            {/* FILE VIEW */}
            {rfp.attachment && (
              <div className="mt-4">
                <a
                  href={rfp.attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                >
                  📄 View Proposal File
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </ManagerLayout>
  );
};

export default ConfirmedRFPs;