const VendorCard = ({ vendor }) => {
  const initial = vendor.businessName?.charAt(0)?.toUpperCase() || "V";

  return (
    <div className="w-[360px] h-[360px] bg-gradient-to-br from-[#1f1f1f] to-[#2b2b2b]
      rounded-2xl shadow-xl p-6 flex flex-col justify-between text-white">

      {/* TOP SECTION */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-[#ff5f5f]
          flex items-center justify-center text-2xl font-extrabold">
          {initial}
        </div>

        <div>
          <h2 className="text-xl font-extrabold tracking-wide">
            {vendor.businessName || "Business Name"}
          </h2>
          <p className="text-sm text-gray-300 font-medium">
            {vendor.email}
          </p>
        </div>
      </div>

      {/* MIDDLE DETAILS */}
      <div className="mt-6 space-y-3 text-[15px] font-semibold text-gray-100">
        <p>
          <span className="text-gray-200 font-medium">Owner:</span>{" "}
          <span className="font-bold text-white">{vendor.name}</span>
        </p>

        <p>
          <span className="text-gray-200 font-medium">Phone:</span>{" "}
          <span className="font-bold text-white">{vendor.phone || "—"}</span>
        </p>

        <p>
          <span className="text-gray-200 font-medium">GST:</span>{" "}
          <span className="font-bold text-white">{vendor.gstNumber || "—"}</span>
        </p>

        <p>
          <span className="text-gray-200 font-medium ">Address:</span>{" "}
          <span className="font-bold text-white">{vendor.address || "—"}</span>
        </p>
      </div>

      {/* DESCRIPTION */}
      <div className="mt-5  border-t border-gray-600 pt-4">
         <p className="text-[15px] font-bold text-gray-200 leading-relaxed">
        {vendor.description || "No description available"}
         </p>     
      </div>
    </div>
  );
};

export default VendorCard;
