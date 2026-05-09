import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEmployeeRFPs, getRFPStats } from "../../services/rfpService";
import Sidebar from "../../components/Employee/SidebarEmployee";
import RfpQuickView from "./RfpQuickView";
import { PageLayout, PageContent, PageHeader, Card, EmptyState, StatusBadge, IconBox } from "../../components/ui/Themed";
import { Plus, FileText, Send, ArrowRight, ChevronLeft, ChevronRight, Clock, TrendingUp } from "lucide-react";

const ITEMS_PER_PAGE = 5;

const STAT_CARDS = [
  { key: "draft", label: "Draft RFPs", sub: "Pending completion", icon: FileText, variant: "stat1" },
  { key: "sent", label: "Sent RFPs", sub: "Awaiting vendor bids", icon: Send, variant: "stat2" },
  { key: "forwarded", label: "Forwarded", sub: "Sent to manager", icon: TrendingUp, variant: "stat3" },
];

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ draft: 0, sent: 0, forwarded: 0 });
  const [rfps, setRfps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openRfpId, setOpenRfpId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/company/login");

    (async () => {
      try {
        const [s, r] = await Promise.all([getRFPStats(), getEmployeeRFPs()]);
        setStats({ draft: s.data.draft || 0, sent: s.data.sent || 0, forwarded: s.data.forwarded || 0 });
        setRfps(r.data);
      } catch (e) {
        console.error("Dashboard Error:", e.response?.data || e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const totalPages = Math.ceil(rfps.length / ITEMS_PER_PAGE);
  const currentRfps = rfps.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  if (loading) {
    return (
      <PageLayout>
        <Sidebar />
        <PageContent>
          <div className="h-8 w-48 rounded-lg animate-shimmer mb-2" />
          <div className="h-5 w-72 rounded-lg animate-shimmer mb-10" />
          <div className="grid grid-cols-3 gap-5 mb-10">
            {[1,2,3].map(i => <div key={i} className="h-[110px] rounded-2xl animate-shimmer" />)}
          </div>
          {[1,2,3,4].map(i => <div key={i} className="h-[76px] rounded-xl animate-shimmer mb-3" />)}
        </PageContent>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Sidebar />
      <PageContent>
        <PageHeader
          title="RFP Dashboard"
          subtitle="Manage your procurement requests efficiently"
          actions={
            <button onClick={() => navigate("/employee/create-rfp")} className="btn-primary">
              <Plus size={16} strokeWidth={2.5} /> New RFP
            </button>
          }
        />

        {/* Stat Cards */}
        <div className="grid grid-cols-3 gap-5 mb-10">
          {STAT_CARDS.map(({ key, label, sub, icon: Icon, variant }, i) => (
            <div key={key} className="rounded-2xl p-6 animate-fadeIn hover:translate-y-[-2px] hover:shadow-md transition-all duration-300 cursor-default"
              style={{ background: `var(--stat-${i+1}-bg)`, border: `1px solid var(--stat-${i+1}-border)`, boxShadow: "var(--shadow-sm)", animationDelay: `${i*100}ms` }}>
              <div className="mb-4">
                <IconBox icon={Icon} variant={variant} className="w-9 h-9" size={16} />
              </div>
              <p className="text-3xl font-bold tracking-tight mb-1" style={{ color: `var(--stat-${i+1}-value)` }}>{stats[key]}</p>
              <p className="t-secondary text-sm font-medium">{label}</p>
              <p className="t-muted text-xs mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        {/* RFP List */}
        <div className="animate-fadeIn" style={{ animationDelay: "300ms" }}>
          <div className="flex justify-between items-center mb-5">
            <h2 className="t-primary text-base font-semibold">All Requests</h2>
            {rfps.length > 0 && <span className="t-muted text-xs font-medium">{rfps.length} total · Page {currentPage} of {totalPages}</span>}
          </div>

          {rfps.length === 0 ? (
            <EmptyState icon={FileText} title="No RFPs yet" subtitle="Create your first request to get started"
              action={<button onClick={() => navigate("/employee/create-rfp")} className="btn-primary"><Plus size={15} /> Create RFP</button>} />
          ) : (
            <>
              <div className="space-y-3">
                {currentRfps.map((rfp) => (
                  <div key={rfp._id}
                    onClick={() => rfp.status === "DRAFT" ? navigate(`/employee/create-rfp?draftId=${rfp._id}`) : rfp.status === "SENT" ? setOpenRfpId(rfp._id) : null}
                    className={`card px-5 py-4 flex items-center justify-between gap-4 transition-all duration-200 group ${(rfp.status === "DRAFT" || rfp.status === "SENT") ? "cursor-pointer hover:shadow-md hover:border-[var(--accent)]" : ""}`}>
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <IconBox icon={FileText} />
                      <div className="min-w-0 flex-1">
                        <p className="t-primary text-sm font-semibold truncate">{rfp.title}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="t-muted text-xs flex items-center gap-1">
                            <Clock size={11} />
                            {new Date(rfp.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                          {rfp.description && <><span style={{ color: "var(--border-color)" }}>·</span><span className="t-muted text-xs truncate max-w-[300px]">{rfp.description}</span></>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <StatusBadge status={rfp.status} />
                      {(rfp.status === "DRAFT" || rfp.status === "SENT") && <ArrowRight size={15} className="t-muted opacity-0 group-hover:opacity-100 transition-all duration-200" />}
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-1.5 mt-8">
                  <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="btn-secondary w-9 h-9 !p-0 justify-center"><ChevronLeft size={15} /></button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setCurrentPage(p)}
                      className={`w-9 h-9 rounded-lg text-[13px] font-semibold transition-all duration-200 ${currentPage === p ? "btn-primary !p-0 justify-center" : "btn-secondary !p-0 justify-center"}`}>{p}</button>
                  ))}
                  <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="btn-secondary w-9 h-9 !p-0 justify-center"><ChevronRight size={15} /></button>
                </div>
              )}
            </>
          )}
        </div>
      </PageContent>
      {openRfpId && <RfpQuickView rfpId={openRfpId} onClose={() => setOpenRfpId(null)} />}
    </PageLayout>
  );
};

export default EmployeeDashboard;