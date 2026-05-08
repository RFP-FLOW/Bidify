import { useEffect, useState } from "react";
import axios from "axios";
import { X, Package, Users } from "lucide-react";
import { SectionLabel } from "../../components/ui/Themed";

export default function RfpQuickView({ rfpId, onClose }) {
  const [rfp, setRfp] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/rfp/${rfpId}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
        setRfp(res.data);
      } catch (e) { console.error(e); }
    })();
  }, [rfpId]);

  if (!rfp) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0" style={{ background: "var(--bg-overlay)" }} onClick={onClose} />
      <div className="relative z-10 w-[480px] max-h-[80vh] overflow-y-auto card p-6 animate-scaleIn">
        <div className="flex justify-between items-start mb-5">
          <div><h2 className="t-primary text-[15px] font-semibold">{rfp.title}</h2><p className="t-muted text-[11px] mt-0.5 font-medium">Sent RFP Details</p></div>
          <button onClick={onClose} className="w-7 h-7 rounded-md flex items-center justify-center t-muted bg-elevated"><X size={14} /></button>
        </div>

        <div className="rounded-lg p-3.5 mb-5 bg-input b-subtle"><p className="t-secondary text-[13px] leading-relaxed">{rfp.description}</p></div>

        <div className="mb-5">
          <SectionLabel icon={Package}>Items</SectionLabel>
          <div className="flex flex-wrap gap-1.5">
            {rfp.items.map((item, i) => <span key={i} className="px-2.5 py-1 text-[11px] font-medium rounded-md" style={{ background: "var(--accent-subtle)", color: "var(--accent-text)" }}>{item.name} × {item.quantity}</span>)}
          </div>
        </div>

        <div>
          <SectionLabel icon={Users}>Sent to Vendors</SectionLabel>
          {rfp.sentToVendors?.length > 0
            ? <div className="flex flex-wrap gap-1.5">{rfp.sentToVendors.map(v => <span key={v._id} className="px-2.5 py-1 text-[11px] font-medium rounded-md" style={{ background: "var(--status-fwd-bg)", color: "var(--status-fwd-text)" }}>{v.name}</span>)}</div>
            : <p className="t-muted text-[12px]">No vendors found</p>
          }
        </div>
      </div>
    </div>
  );
}
