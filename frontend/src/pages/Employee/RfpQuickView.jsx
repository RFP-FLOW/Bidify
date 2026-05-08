import { useEffect, useState } from "react";
import axios from "axios";
import { X, Package, Users } from "lucide-react";

export default function RfpQuickView({ rfpId, onClose }) {
  const [rfp, setRfp] = useState(null);

  useEffect(() => {
    const fetchRfp = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/rfp/${rfpId}`,
          { headers: { Authorization: `Bearer ${token}` } }
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
        className="absolute inset-0"
        style={{ background: "var(--bg-overlay)" }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative z-10 w-[480px] max-h-[80vh] overflow-y-auto rounded-xl p-6 animate-scaleIn"
        style={{
          background: "var(--bg-modal)",
          border: "1px solid var(--border-color)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-5">
          <div>
            <h2 className="text-[15px] font-semibold"
              style={{ color: "var(--text-primary)" }}>
              {rfp.title}
            </h2>
            <p className="text-[11px] mt-0.5 font-medium"
              style={{ color: "var(--text-muted)" }}>
              Sent RFP Details
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md flex items-center justify-center transition-colors duration-150"
            style={{ color: "var(--text-muted)", background: "var(--bg-hover)" }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Description */}
        <div className="rounded-lg p-3.5 mb-5"
          style={{ background: "var(--bg-input)", border: "1px solid var(--border-subtle)" }}>
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {rfp.description}
          </p>
        </div>

        {/* Items */}
        <div className="mb-5">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Package size={12} style={{ color: "var(--text-muted)" }} />
            <h3 className="text-[12px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--text-muted)" }}>
              Items
            </h3>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {rfp.items.map((item, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 text-[11px] font-medium rounded-md"
                style={{
                  background: "var(--accent-subtle)",
                  color: "var(--accent-text)",
                }}
              >
                {item.name} × {item.quantity}
              </span>
            ))}
          </div>
        </div>

        {/* Vendors */}
        <div>
          <div className="flex items-center gap-1.5 mb-2.5">
            <Users size={12} style={{ color: "var(--text-muted)" }} />
            <h3 className="text-[12px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--text-muted)" }}>
              Sent to Vendors
            </h3>
          </div>
          {rfp.sentToVendors?.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {rfp.sentToVendors.map((v) => (
                <span key={v._id}
                  className="px-2.5 py-1 text-[11px] font-medium rounded-md"
                  style={{
                    background: "var(--status-fwd-bg)",
                    color: "var(--status-fwd-text)",
                  }}>
                  {v.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
              No vendors found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
