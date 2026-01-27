const VendorCard = ({ vendor }) => {
  return (
    <div className="bg-[#1f1f1f] text-white rounded-xl shadow-lg overflow-hidden">

      {/* TOP */}
      <div className="flex items-center gap-4 p-4 border-b border-white/10">
        <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-xl font-semibold">
          {vendor.businessName?.charAt(0) || "V"}
        </div>

        <div>
          <h3 className="text-lg font-semibold">
            {vendor.businessName}
          </h3>
          <p className="text-sm text-gray-300">
            {vendor.email}
          </p>
        </div>
      </div>

      {/* DETAILS */}
      <div className="p-4 space-y-1 text-sm">
        <p><span className="text-gray-400">Owner:</span> {vendor.name}</p>
        <p><span className="text-gray-400">Phone:</span> {vendor.phone}</p>
        <p><span className="text-gray-400">GST:</span> {vendor.gstNumber}</p>
        <p><span className="text-gray-400">Address:</span> {vendor.address}</p>
      </div>

      {/* DESCRIPTION */}
      <div className="px-4 pb-4 text-sm text-gray-300">
        {vendor.description}
      </div>
    </div>
  );
};

export default VendorCard;
