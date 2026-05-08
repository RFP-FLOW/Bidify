import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Sidebar from "../../components/Employee/SidebarEmployee";
import { toast } from "react-toastify";
import { PageLayout, PageContent, PageHeader, Card, SectionLabel } from "../../components/ui/Themed";
import { Sparkles, RotateCcw, FileText, Loader2, Package } from "lucide-react";

function CreateRFP() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get("draftId");
  const [prompt, setPrompt] = useState("");
  const [aiRFP, setAiRFP] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const hasLoadedDraft = useRef(false);

  useEffect(() => {
    if (!draftId || hasLoadedDraft.current) return;
    hasLoadedDraft.current = true;
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/rfp/${draftId}`, { headers: { Authorization: `Bearer ${token}` } });
        setPrompt(res.data.description || "");
        setAiRFP({ title: res.data.title, items: res.data.items || [] });
        toast.info("Draft loaded for editing");
      } catch (e) { console.error(e); toast.error("Failed to load draft RFP"); }
    })();
  }, [draftId]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return toast.error("Please describe your requirements");
    try {
      setLoadingAI(true);
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/rfp/generate", { prompt }, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true });
      setAiRFP(res.data.data);
      toast.success("AI-generated RFP structure ready");
    } catch (e) { console.error(e); toast.error(e.response?.data?.message || "Failed to generate RFP using AI"); }
    finally { setLoadingAI(false); }
  };

  const handleCreateRFP = async () => {
    if (!aiRFP) return toast.error("Please generate RFP using AI first");
    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      const body = { title: aiRFP.title?.trim() || "Procurement Request", description: prompt, items: aiRFP.items };
      const res = draftId
        ? await axios.put(`http://localhost:5000/api/rfp/${draftId}`, body, { headers: { Authorization: `Bearer ${token}` } })
        : await axios.post("http://localhost:5000/api/rfp", body, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(draftId ? "Draft updated successfully" : "RFP created successfully");
      navigate(`/rfp/${res.data.rfp._id}`);
    } catch (e) { console.error(e); toast.error("Failed to save RFP"); }
    finally { setSubmitting(false); }
  };

  return (
    <PageLayout>
      <Sidebar />
      <PageContent>
        <PageHeader title={draftId ? "Edit Draft RFP" : "Create New RFP"} subtitle="Describe your requirements and let AI structure them for you" />

        {/* Prompt */}
        <Card className="max-w-3xl mx-auto p-6 mb-6" delay={80}>
          <label className="t-primary block text-sm font-semibold mb-3">Requirements Description</label>
          <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={5}
            placeholder="e.g. Need 15 laptops with i7 processor, 16GB RAM, and 3-year warranty for the engineering team..."
            className="input-themed" />
          <div className="flex justify-end mt-4">
            <button onClick={handleGenerate} disabled={loadingAI} className="btn-primary">
              {loadingAI ? <><Loader2 size={15} className="animate-spin" /> Generating...</> : <><Sparkles size={15} /> Generate with AI</>}
            </button>
          </div>
        </Card>

        {/* AI Output */}
        {aiRFP && (
          <Card className="max-w-3xl mx-auto p-6" delay={100}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--stat-3-accent-bg)", color: "var(--stat-3-accent)" }}>
                <Sparkles size={16} />
              </div>
              <div>
                <h2 className="t-primary text-sm font-semibold">AI-Generated Structure</h2>
                <p className="t-muted text-xs">Review the output and create your RFP</p>
              </div>
            </div>

            {aiRFP.title && (
              <div className="mb-4">
                <SectionLabel>Title</SectionLabel>
                <p className="t-primary text-base font-semibold">{aiRFP.title}</p>
              </div>
            )}

            {aiRFP.items?.length > 0 && (
              <div className="mb-5">
                <SectionLabel icon={Package}>Items ({aiRFP.items.length})</SectionLabel>
                <div className="rounded-xl overflow-hidden b-default">
                  {aiRFP.items.map((item, idx) => (
                    <div key={idx} className={`px-4 py-3 flex items-center justify-between text-sm ${idx % 2 === 0 ? "bg-input" : "bg-card"}`}
                      style={{ borderBottom: idx < aiRFP.items.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
                      <span className="t-primary font-medium">{item.name}</span>
                      <span className="t-muted text-xs font-semibold">Qty: {item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <details className="mb-5">
              <summary className="t-muted text-xs cursor-pointer hover:underline font-medium">View raw JSON</summary>
              <pre className="mt-2 rounded-xl p-4 text-xs overflow-auto bg-input t-secondary b-subtle">{JSON.stringify(aiRFP, null, 2)}</pre>
            </details>

            <div className="flex justify-between items-center pt-5 bt-default">
              <button onClick={() => { setAiRFP(null); handleGenerate(); }} className="btn-secondary">
                <RotateCcw size={14} /> Regenerate
              </button>
              <button onClick={handleCreateRFP} disabled={submitting} className="btn-primary">
                {submitting ? <><Loader2 size={15} className="animate-spin" /> {draftId ? "Updating..." : "Creating..."}</> : <><FileText size={15} /> {draftId ? "Update Draft" : "Create RFP"}</>}
              </button>
            </div>
          </Card>
        )}
      </PageContent>
    </PageLayout>
  );
}

export default CreateRFP;