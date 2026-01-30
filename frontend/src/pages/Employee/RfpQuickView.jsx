import { useEffect, useState } from "react";
import axios from "axios";

export default function RfpQuickView({ rfpId, onClose }) {
  const [rfp, setRfp] = useState(null);

  useEffect(() => {
    const fetchRfp = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/rfp/${rfpId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRfp(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRfp();
  }, [rfpId]);

  if (!rfp) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-[520px] rounded-2xl bg-white shadow-2xl p-6 animate-scaleIn border border-gray-100">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#5b3df5]">
              {rfp.title}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Sent RFP Details
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg">
          {rfp.description}
        </p>

        {/* Items */}
        <div className="mb-4">
          <h3 className="font-semibold text-sm mb-2 text-gray-700">
            Items
          </h3>
          <div className="flex flex-wrap gap-2">
            {rfp.items.map((item, idx) => (
              <span
                key={idx}
                className="px-3 py-1 text-sm rounded-full bg-[#eef4ff] text-[#5b3df5]"
              >
                {item.name} × {item.quantity}
              </span>
            ))}
          </div>
        </div>

        {/* Vendors */}
        <div>
          <h3 className="font-semibold text-sm mb-2 text-gray-700">
            Sent To Vendors
          </h3>

          {rfp.sentToVendors?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {rfp.sentToVendors.map((v) => (
                <span
                  key={v._id}
                  className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700"
                >
                  {v.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">
              No vendors found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
