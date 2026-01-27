const VendorDetailsModal = ({ request, onClose, onApprove, onReject }) => {
  if (!request) return null;

  const { vendorId, _id } = request;
    console.log("VENDOR OBJECT =>", vendorId);

  return (
    
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[440px] p-6 relative shadow-lg">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-xl text-gray-400 hover:text-gray-600"
        >
          ×
        </button>

        {/* Header */}
        <h2 className="text-xl font-semibold text-gray-900">
          {vendorId?.businessName || vendorId?.name || "Vendor"}
        </h2>

        <p className="text-sm text-gray-500 mb-4">
          {vendorId?.email || "No email provided"}
        </p>

        {/* Vendor Details */}
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            <span className="font-medium">GST No:</span>{" "}
            {vendorId?.gstNumber || "—"}
          </p>

          <p>
            <span className="font-medium">Phone:</span>{" "}
            {vendorId?.phone || "—"}
          </p>

          <p>
            <span className="font-medium">Address:</span>{" "}
            {vendorId?.address || "—"}
          </p>

          <p>
            <span className="font-medium">Description:</span>{" "}
            {vendorId?.description || "—"}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => onReject(_id)}
            className="px-4 py-2 rounded-md bg-red-500 text-white text-sm hover:bg-red-600"
          >
            Reject
          </button>

          <button
            onClick={() => onApprove(_id)}
            className="px-4 py-2 rounded-md bg-green-600 text-white text-sm hover:bg-green-700"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorDetailsModal;
