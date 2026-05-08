import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Employee/SidebarEmployee";
import { PageLayout, PageContent, Card, SectionLabel } from "../../components/ui/Themed";
import { ArrowLeft, Trophy, Send, Loader2, CheckCircle2, AlertCircle, Package } from "lucide-react";

const ForwardToManager = () => {
  const { rfpId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [aiResult, setAiResult] = useState(location.state?.aiResult || null);
  const [rfpTitle, setRfpTitle] = useState(location.state?.rfpTitle || "");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(!aiResult);
  const [error, setError] = useState("");
  const [managerInfo, setManagerInfo] = useState(null);

  useEffect(() => {
    if (aiResult) return;
    (async () => {
      try { setLoading(true);
        const rfpRes = await axios.get(`http://localhost:5000/api/rfp/${rfpId}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
        setRfpTitle(rfpRes.data.title || "");
        const aiRes = await axios.post(`http://localhost:5000/api/ai/recommend/${rfpId}`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
        setAiResult(aiRes.data.recommendation);
      } catch { setError("Could not load AI recommendations. Go back and run the AI comparison first."); }
      finally { setLoading(false); }
    })();
  }, [rfpId]);

  const handleForward = async () => {
    if (!note.trim()) return setError("Please add a note before forwarding.");
    setError("");
    try { setSending(true);
      const res = await axios.post(`http://localhost:5000/api/rfp/${rfpId}/forward-to-manager`, { note, aiResult, rfpTitle }, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      setManagerInfo({ name: res.data.managerName, email: res.data.managerEmail }); setSent(true);
    } catch (e) { setError(e.response?.data?.message || "Failed to forward."); }
    finally { setSending(false); }
  };

  const top3 = aiResult?.topRecommendations?.slice(0, 3) || [];
  const analysisMap = {}; aiResult?.vendorsAnalysis?.forEach(v => { analysisMap[v.vendor] = v; });
  const rankBg = ["var(--stat-3-accent)", "var(--stat-2-accent)", "var(--stat-1-accent)"];

  return (
    <PageLayout>
      <Sidebar />
      <PageContent className="max-w-4xl">
        {/* Header */}
        <div className="mb-6 animate-fadeIn">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm font-medium mb-4 t-accent hover:underline"><ArrowLeft size={14} /> Back to Proposals</button>
          <h1 className="t-primary text-2xl font-bold tracking-[-0.02em] mb-1">Forward to Manager</h1>
          {rfpTitle && <p className="t-secondary text-sm">RFP: <span className="t-primary font-medium">{rfpTitle}</span></p>}
        </div>

        {loading && <Card className="p-8 text-center"><Loader2 size={28} className="animate-spin mx-auto mb-3" style={{ color: "var(--accent)" }} /><p className="t-secondary text-sm">Loading AI recommendations...</p></Card>}

        {sent && (
          <Card className="p-8 text-center" style={{ background: "var(--stat-3-accent-bg)", border: "1px solid var(--stat-3-border)" }}>
            <CheckCircle2 size={40} className="mx-auto mb-3" style={{ color: "var(--stat-3-accent)" }} />
            <h2 className="text-xl font-bold mb-1" style={{ color: "var(--stat-3-accent)" }}>Forwarded Successfully!</h2>
            <p className="t-secondary text-sm">Email sent to <span className="font-semibold">{managerInfo?.name}</span> ({managerInfo?.email})</p>
            <button onClick={() => navigate("/employee/dashboard")} className="btn-primary mt-5 mx-auto">Go to Dashboard</button>
          </Card>
        )}

        {!loading && !sent && aiResult && (
          <>
            {/* Top Vendors */}
            <div className="mb-6 animate-fadeIn" style={{ animationDelay: "80ms" }}>
              <div className="flex items-center gap-2 mb-4">
                <Trophy size={16} style={{ color: "var(--stat-1-accent)" }} />
                <h2 className="t-primary text-base font-semibold">Top Vendor Recommendations</h2>
                <span className="t-muted text-xs">(included in email)</span>
              </div>
              <div className="space-y-3">
                {top3.map((vendor, i) => {
                  const a = analysisMap[vendor.vendor];
                  return (
                    <Card key={i} className="p-5" style={{ borderLeft: `4px solid ${rankBg[i]}` }}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ background: rankBg[i] }}>#{i+1}</span>
                          <div><p className="t-primary text-sm font-semibold">{vendor.vendor}</p><p className="t-muted text-xs">{vendor.email}</p></div>
                        </div>
                        <p style={{ color: "var(--stat-3-accent)" }} className="text-base font-bold">₹{Number(vendor.grandTotal).toLocaleString("en-IN")}</p>
                      </div>
                      {a && (
                        <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                          {a.deliveryDays && <div className="rounded-lg px-3 py-2 bg-input b-subtle"><p className="t-muted text-[11px] uppercase tracking-wider font-semibold">Delivery</p><p className="t-primary font-semibold text-sm">{a.deliveryDays} days</p></div>}
                          {a.deliveryCharge !== undefined && <div className="rounded-lg px-3 py-2 bg-input b-subtle"><p className="t-muted text-[11px] uppercase tracking-wider font-semibold">Delivery Charge</p><p className="t-primary font-semibold text-sm">₹{Number(a.deliveryCharge).toLocaleString("en-IN")}</p></div>}
                        </div>
                      )}
                      {a?.itemBreakdown?.length > 0 && (
                        <div className="mb-3"><SectionLabel icon={Package}>Items</SectionLabel>
                          <div className="flex flex-wrap gap-1.5">{a.itemBreakdown.map((it, idx) => <span key={idx} className="px-2.5 py-1 text-[11px] font-medium rounded-md" style={{ background: "var(--accent-subtle)", color: "var(--accent-text)" }}>{it.item} — ₹{Number(it.totalItemPrice).toLocaleString("en-IN")}</span>)}</div>
                        </div>
                      )}
                      {a?.reason && <div className="rounded-lg px-3 py-2 text-xs" style={{ background: "var(--stat-1-accent-bg)", color: "var(--stat-1-accent)", border: "1px solid var(--stat-1-border)" }}>💡 {a.reason}</div>}
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Note */}
            <Card className="p-6 mb-4" delay={160}>
              <label className="t-primary block text-sm font-semibold mb-3">Your Note to Manager <span className="text-red-400">*</span></label>
              <textarea value={note} onChange={e => setNote(e.target.value)} rows={5}
                placeholder="e.g. Based on the AI analysis, Vendor A offers the best price-to-delivery ratio..."
                className="input-themed" />
              <p className="t-muted text-xs mt-2">This message will appear in the email sent to your manager.</p>
            </Card>

            {error && <div className="rounded-xl px-4 py-3 mb-4 flex items-center gap-2 text-sm" style={{ background: "var(--status-draft-bg)", color: "var(--status-draft-text)", border: "1px solid var(--stat-1-border)" }}><AlertCircle size={14} /> {error}</div>}

            <div className="flex items-center gap-4 animate-fadeIn" style={{ animationDelay: "240ms" }}>
              <button onClick={handleForward} disabled={sending} className="btn-primary">
                {sending ? <><Loader2 size={15} className="animate-spin" /> Sending...</> : <><Send size={15} /> Forward to Manager</>}
              </button>
              <button onClick={() => navigate(-1)} className="t-muted text-sm font-medium hover:underline">Cancel</button>
            </div>
          </>
        )}

        {!loading && !sent && !aiResult && error && (
          <div className="rounded-xl px-4 py-3 mt-6 flex items-center gap-2 text-sm" style={{ background: "var(--status-draft-bg)", color: "var(--status-draft-text)", border: "1px solid var(--stat-1-border)" }}><AlertCircle size={14} /> {error}</div>
        )}
      </PageContent>
    </PageLayout>
  );
};

export default ForwardToManager;
