import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Employee/SidebarEmployee";
import { useNavigate } from "react-router-dom";
import { PageLayout, PageContent, PageHeader, EmptyState, IconBox } from "../../components/ui/Themed";
import { Gavel, FileText, Clock, ChevronLeft, ChevronRight, ArrowRight, Inbox } from "lucide-react";

const Proposals = () => {
  const navigate = useNavigate();
  const [rfps, setRfps] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/rfp/bids?page=${page}&limit=5`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setRfps(Array.isArray(res?.data?.rfps) ? res.data.rfps : []);
        setTotalPages(res?.data?.totalPages || 1);
      } catch (e) { console.error(e); setRfps([]); }
      finally { setLoading(false); }
    })();
  }, [page]);

  const hasAnyBid = rfps.some(r => r.bidCount > 0);

  return (
    <PageLayout>
      <Sidebar />
      <PageContent>
        <PageHeader title="Vendor Proposals" subtitle="Track vendor proposals for your sent RFPs" />

        {loading && <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-[80px] rounded-xl animate-shimmer" />)}</div>}

        {!loading && rfps.length === 0 && (
          <EmptyState icon={Inbox} title="No sent RFPs yet" subtitle="Send an RFP to vendors to start receiving proposals" />
        )}

        {!loading && rfps.length > 0 && !hasAnyBid && (
          <div className="rounded-xl px-5 py-4 mb-6 flex items-center gap-3 animate-fadeIn"
            style={{ background: "var(--stat-2-accent-bg)", border: "1px solid var(--stat-2-border)", color: "var(--stat-2-accent)" }}>
            <Clock size={16} />
            <p className="text-sm font-medium">RFPs have been sent. Waiting for vendor responses.</p>
          </div>
        )}

        {!loading && rfps.length > 0 && (
          <div className="space-y-3 animate-fadeIn" style={{ animationDelay: "100ms" }}>
            {rfps.map(rfp => (
              <div key={rfp._id} onClick={() => navigate(`/employee/rfp/${rfp._id}/proposals`)}
                className="card px-5 py-4 flex items-center justify-between gap-4 cursor-pointer transition-all duration-200 group hover:shadow-md hover:border-[var(--accent)]">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <IconBox icon={FileText} />
                  <div className="min-w-0 flex-1">
                    <p className="t-primary text-sm font-semibold truncate">{rfp.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="t-muted text-xs flex items-center gap-1"><Clock size={11} />{new Date(rfp.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      {rfp.description && <><span style={{ color: "var(--border-color)" }}>·</span><span className="t-muted text-xs truncate max-w-[280px]">{rfp.description}</span></>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold"
                    style={{ background: rfp.bidCount > 0 ? "var(--status-fwd-bg)" : "var(--status-sent-bg)", color: rfp.bidCount > 0 ? "var(--status-fwd-text)" : "var(--status-sent-text)" }}>
                    <Gavel size={12} />{rfp.bidCount} {rfp.bidCount === 1 ? "Proposal" : "Proposals"}
                  </span>
                  <ArrowRight size={15} className="t-muted opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-1.5 mt-8">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-secondary w-9 h-9 !p-0 justify-center"><ChevronLeft size={15} /></button>
            <span className="t-muted text-xs font-medium px-3">Page {page} of {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="btn-secondary w-9 h-9 !p-0 justify-center"><ChevronRight size={15} /></button>
          </div>
        )}
      </PageContent>
    </PageLayout>
  );
};

export default Proposals;
