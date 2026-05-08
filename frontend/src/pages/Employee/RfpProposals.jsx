import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Employee/SidebarEmployee";
import { PageLayout, PageContent, PageHeader, Card, EmptyState } from "../../components/ui/Themed";
import { Bot, Trophy, Clock, DollarSign, Paperclip, ExternalLink, ArrowUpRight, Mail } from "lucide-react";

const getFileLabel = (url) => {
  if (!url) return "Download File";
  const l = url.toLowerCase();
  if (l.includes(".pdf")) return "View PDF";
  if (l.includes(".doc")) return "View Document";
  if (l.includes(".xls")) return "View Excel";
  return "Download File";
};

const RfpProposals = () => {
  const { rfpId } = useParams();
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [rfpTitle, setRfpTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/rfp/${rfpId}/proposals`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
        setProposals(res.data.proposals);
        setRfpTitle(res.data.rfpTitle);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [rfpId]);

  const handleAICompare = async () => {
    try { setAiLoading(true);
      const res = await axios.post(`http://localhost:5000/api/ai/recommend/${rfpId}`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      setAiResult(res.data.recommendation);
    } catch (e) { console.error(e); }
    finally { setAiLoading(false); }
  };

  return (
    <PageLayout>
      <Sidebar />
      <PageContent>
        <PageHeader title={rfpTitle || "Proposals"} subtitle="Vendor Proposals" />

        <div className="mb-6 animate-fadeIn" style={{ animationDelay: "80ms" }}>
          <button onClick={handleAICompare} disabled={proposals.length < 2 || aiLoading} className="btn-primary">
            <Bot size={16} /> {aiLoading ? "Analyzing..." : "Compare & Recommend using AI"}
          </button>
        </div>

        {aiLoading && (
          <div className="rounded-xl px-5 py-4 mb-6 flex items-center gap-3" style={{ background: "var(--accent-subtle)", border: "1px solid var(--border-color)", color: "var(--accent-text)" }}>
            <Bot size={16} className="animate-pulse" /><p className="text-sm font-medium">AI is analyzing vendor proposals...</p>
          </div>
        )}

        {aiResult && (
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-2 mb-4"><Trophy size={16} style={{ color: "var(--stat-1-accent)" }} /><h2 className="t-primary text-base font-semibold">Top Recommendations</h2></div>
            <div className="space-y-2 mb-5">
              {aiResult.topRecommendations?.map((v, i) => (
                <div key={i} className="rounded-xl px-4 py-3 flex items-center justify-between"
                  style={{ background: i === 0 ? "var(--stat-3-accent-bg)" : "var(--bg-input)", border: `1px solid ${i === 0 ? "var(--stat-3-border)" : "var(--border-subtle)"}` }}>
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: ["var(--stat-3-accent)","var(--stat-2-accent)","var(--stat-1-accent)"][i] || "var(--stat-1-accent)" }}>#{i+1}</span>
                    <div><p className="t-primary text-sm font-semibold">{v.vendor}</p><p className="t-muted text-xs">{v.email}</p></div>
                  </div>
                  <div className="text-right">
                    <p style={{ color: "var(--stat-3-accent)" }} className="text-sm font-bold">₹{(v.grandTotal || 0).toLocaleString("en-IN")}</p>
                    {v.deliveryDays > 0 && <p className="t-muted text-xs">{v.deliveryDays} days</p>}
                  </div>
                </div>
              ))}
            </div>

            <details>
              <summary className="t-secondary text-sm font-medium cursor-pointer hover:underline">View Detailed Analysis</summary>
              <div className="space-y-3 mt-3">
                {aiResult.vendorsAnalysis?.map((v, i) => (
                  <div key={i} className="rounded-xl p-4 bg-input b-subtle">
                    <p className="t-primary text-sm font-semibold mb-2">{v.vendor}</p>
                    {v.itemBreakdown?.map((it, idx) => <p key={idx} className="t-secondary text-xs mb-1">{it.item} — ₹{it.totalItemPrice}</p>)}
                    <p className="t-muted text-xs">Delivery: {v.deliveryDays || 0} days</p>
                    <p className="t-accent text-sm font-bold mt-1">Total: ₹{(v.grandTotal || 0).toLocaleString("en-IN")}</p>
                    {v.reason && <div className="mt-2 rounded-lg px-3 py-2 text-xs" style={{ background: "var(--stat-1-accent-bg)", color: "var(--stat-1-accent)", border: "1px solid var(--stat-1-border)" }}>💡 {v.reason}</div>}
                  </div>
                ))}
              </div>
            </details>

            <div className="mt-5 pt-5 flex items-center justify-between bt-default">
              <p className="t-muted text-sm">Ready to send these to your manager?</p>
              <button onClick={() => navigate(`/employee/rfp/${rfpId}/forward`, { state: { aiResult, rfpTitle } })}
                className="btn-primary" style={{ background: "var(--stat-3-accent)", boxShadow: "0 2px 8px rgba(16, 185, 129, 0.25)" }}>
                <ArrowUpRight size={15} /> Forward to Manager
              </button>
            </div>
          </Card>
        )}

        {loading && <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-36 rounded-2xl animate-shimmer" />)}</div>}

        {!loading && proposals.length === 0 && <EmptyState icon={Mail} title="No proposals received yet" subtitle="Proposals will appear here once vendors respond" />}

        {!loading && proposals.length > 0 && (
          <div className="space-y-4">
            {proposals.map(p => (
              <Card key={p._id} className="p-6 hover:shadow-md transition-all duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white" style={{ background: "var(--accent)" }}>{p.vendorId?.name?.[0] || "V"}</div>
                    <div><p className="t-primary text-sm font-semibold">{p.vendorId?.name}</p><p className="t-muted text-xs">{p.vendorId?.email}</p></div>
                  </div>
                  {p.quotedPrice && <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold" style={{ background: "var(--status-fwd-bg)", color: "var(--status-fwd-text)" }}><DollarSign size={13} />₹{p.quotedPrice}</span>}
                </div>
                <div className="rounded-xl p-4 text-sm leading-relaxed mb-3 bg-input t-secondary b-subtle">{p.message}</div>
                {p.attachment && <a href={p.attachment} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-medium t-accent hover:underline"><Paperclip size={12} />{getFileLabel(p.attachment)}<ExternalLink size={10} /></a>}
                <div className="mt-3 pt-3 flex items-center gap-1 bt-default t-muted"><Clock size={11} /><span className="text-xs">Received {new Date(p.updatedAt).toLocaleString()}</span></div>
              </Card>
            ))}
          </div>
        )}
      </PageContent>
    </PageLayout>
  );
};

export default RfpProposals;