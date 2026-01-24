import { useState } from "react";

function SelectVendorsModal({ isOpen, onClose, vendors = [] }) {
  const [selected, setSelected] = useState([]);

  if (!isOpen) return null;

  const toggleVendor = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((v) => v !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[420px] rounded-2xl p-6 shadow-xl">
        {/* Header */}
        <h2 className="text-xl font-bold text-purple-700 text-center">
          Select Vendors
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Choose which vendors to send this RFP to
        </p>

        {/* Vendor List */}
        <div className="space-y-3 max-h-60 overflow-auto">
          {vendors.map((vendor) => (
            <div
              key={vendor._id}
              className={`flex items-center gap-4 p-3 rounded-xl border cursor-pointer
                ${
                  selected.includes(vendor._id)
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200"
                }`}
              onClick={() => toggleVendor(vendor._id)}
            >
              <input
                type="checkbox"
                checked={selected.includes(vendor._id)}
                readOnly
              />

              <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-purple-600 text-white font-bold">
                {vendor.name[0]}
              </div>

              <div>
                <p className="font-medium">{vendor.name}</p>
                <p className="text-sm text-gray-500">{vendor.email}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 rounded-lg"
          >
            Cancel
          </button>

          <button
            disabled={selected.length === 0}
            className="px-6 py-2 rounded-lg text-white bg-gradient-to-r from-purple-500 to-indigo-500 disabled:opacity-50"
          >
            ✈️ Send ({selected.length})
          </button>
        </div>
      </div>
    </div>
  );
}

export default SelectVendorsModal;
