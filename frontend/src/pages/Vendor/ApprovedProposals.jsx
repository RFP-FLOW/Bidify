import { useEffect, useState } from "react";
import axios from "axios";
import VendorLayout from "../../components/Vendor/Layout";

const ApprovedProposals = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/vendor/approved", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setData(res.data.proposals))
      .catch((err) => console.error(err));
  }, []);

 return (
    <VendorLayout>
      <div className="p-6">
    {/* HEADER */}
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-800">
        Approved Proposals
      </h1>
      <p className="text-sm text-gray-400 mt-1">
        Proposals approved by companies
      </p>
    </div>

    {/* EMPTY */}
    {data.length === 0 && (
      <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
        <p className="text-gray-400 text-sm">
          No approved proposals yet
        </p>
      </div>
    )}

    {/* LIST */}
    <div className="space-y-6">
      {data.map((p, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm border-l-4 border-green-500 hover:shadow-md transition"
        >
          {/* TOP SECTION */}
         <div className="flex justify-between items-start">
  <div>
    <h2 className="text-lg font-semibold text-gray-800">
      {p.rfpTitle}
    </h2>

    <p className="text-xs text-gray-400 mt-1">
      Approved by Company
    </p>

    {/* 🔴 NEW COMPANY DETAILS */}
    <p className="text-sm font-semibold text-gray-800 mt-2">
      {p.companyName}
    </p>

    <p className="text-sm font-bold text-gray-700 mt-1">
      {p.companyEmail}
    </p>

    <p className="text-sm font-bold text-gray-700 mt-1">
      GST: {p.companyGst}
    </p>
  </div>

  <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
    APPROVED
  </span>
</div>

          {/* DIVIDER */}
          <div className="border-t border-gray-100 my-5"></div>

          {/* DETAILS GRID */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            {/* PRICE */}
            <div>
              <p className="text-gray-400 text-xs">Total Cost</p>
              <p className="text-xl font-bold text-green-600">
                ₹{Number(p.price || 0).toLocaleString("en-IN")}
              </p>
            </div>

            {/* DELIVERY */}
            <div>
              <p className="text-gray-400 text-xs">Delivery</p>
              <p className="font-medium text-gray-700">
                {p.deliveryDays} days
              </p>
            </div>

            {/* DATE */}
            <div>
              <p className="text-gray-400 text-xs">Approved On</p>
              <p className="font-medium text-gray-700">
                {new Date(p.approvedAt).toLocaleDateString("en-IN")}
              </p>
            </div>
          </div>

          {/* FILE SECTION */}
          {p.attachment && (
            <div className="mt-5 flex justify-between items-center">
              <p className="text-xs text-gray-400">
                Attached Proposal
              </p>

              <a
                href={p.attachment}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-medium"
              >
                📄 View File
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
      </div>
    </VendorLayout>
  );
}

export default ApprovedProposals;