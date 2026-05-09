import { X, Check, XCircle } from "lucide-react";

const VendorDetailsModal = ({ request, onClose, onApprove, onReject }) => {
  if (!request) return null;
  const { vendorId, _id } = request;

  const fields = [
    { label: "GST No", value: vendorId?.gstNumber },
    { label: "Phone", value: vendorId?.phone },
    { label: "Address", value: vendorId?.address },
    { label: "Description", value: vendorId?.description },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0" style={{ background: "var(--bg-overlay)" }} onClick={onClose} />
      <div className="relative z-10 w-[440px] card p-6 animate-scaleIn">
        <div className="flex justify-between items-start mb-5">
          <div>
            <h2 className="t-primary text-base font-semibold">{vendorId?.businessName || vendorId?.name || "Vendor"}</h2>
            <p className="t-muted text-xs mt-0.5">{vendorId?.email || "No email"}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-md flex items-center justify-center t-muted bg-elevated"><X size={14} /></button>
        </div>

        <div className="space-y-3 mb-6">
          {fields.map(({ label, value }) => (
            <div key={label} className="rounded-lg px-3 py-2 bg-input b-subtle">
              <p className="t-muted text-[11px] uppercase tracking-wider font-semibold">{label}</p>
              <p className="t-primary text-sm font-medium mt-0.5">{value || "—"}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-4 bt-default">
          <button onClick={() => onReject(_id)} className="btn-secondary !text-red-500 hover:!bg-red-50"><XCircle size={14} /> Reject</button>
          <button onClick={() => onApprove(_id)} className="btn-primary" style={{ background: "var(--stat-3-accent)" }}><Check size={14} /> Approve</button>
        </div>
      </div>
    </div>
  );
};

export default VendorDetailsModal;
