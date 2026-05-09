import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { X, Send, Loader2, Check } from "lucide-react";

function SelectVendorsModal({ isOpen, onClose, vendors = [], loading = false, rfpId }) {
  const [selected, setSelected] = useState([]);
  const [sending, setSending] = useState(false);

  if (!isOpen) return null;

  const toggle = (id) => setSelected(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]);
  const close = () => { setSelected([]); onClose(); };

  const handleSend = async () => {
    try { setSending(true);
      await axios.post(`http://localhost:5000/api/rfp/${rfpId}/send`, { vendorIds: selected }, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      toast.success("RFP sent to vendors"); close();
    } catch (e) { console.error(e); toast.error("Failed to send RFP"); }
    finally { setSending(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0" style={{ background: "var(--bg-overlay)" }} onClick={close} />
      <div className="relative z-10 w-[440px] card p-6 animate-scaleIn">
        {/* Header */}
        <div className="flex justify-between items-start mb-5">
          <div><h2 className="t-primary text-base font-semibold">Select Vendors</h2><p className="t-muted text-xs mt-0.5">Choose which vendors to send this RFP to</p></div>
          <button onClick={close} className="w-7 h-7 rounded-md flex items-center justify-center t-muted bg-elevated"><X size={14} /></button>
        </div>

        {loading && <div className="py-8 text-center"><Loader2 size={20} className="animate-spin mx-auto mb-2" style={{ color: "var(--accent)" }} /><p className="t-muted text-sm">Loading vendors...</p></div>}
        {!loading && vendors.length === 0 && <div className="py-8 text-center"><p className="t-muted text-sm">No approved vendors yet</p></div>}

        {!loading && vendors.length > 0 && (
          <>
            <div className="space-y-2 max-h-64 overflow-auto mb-5">
              {vendors.map(v => {
                const sel = selected.includes(v._id);
                return (
                  <div key={v._id} onClick={() => toggle(v._id)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200"
                    style={{ background: sel ? "var(--accent-subtle)" : "transparent", border: `1px solid ${sel ? "var(--accent)" : "var(--border-color)"}` }}>
                    <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all"
                      style={sel ? { background: "var(--accent)" } : { border: "2px solid var(--border-color)" }}>
                      {sel && <Check size={12} className="text-white" strokeWidth={3} />}
                    </div>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: "var(--accent)" }}>{v.name?.[0] || "V"}</div>
                    <div className="min-w-0 flex-1"><p className="t-primary text-sm font-medium truncate">{v.name}</p><p className="t-muted text-xs truncate">{v.email}</p></div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between items-center pt-4 bt-default">
              <button onClick={close} className="btn-secondary">Cancel</button>
              <button onClick={handleSend} disabled={selected.length === 0 || sending} className="btn-primary">
                {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Send ({selected.length})
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SelectVendorsModal;
