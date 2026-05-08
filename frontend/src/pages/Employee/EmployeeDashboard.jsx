import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEmployeeRFPs, getRFPStats } from "../../services/rfpService";
import Sidebar from "../../components/Employee/SidebarEmployee";
import RfpQuickView from "./RfpQuickView";
import {
  Plus,
  FileText,
  Send,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  TrendingUp,
} from "lucide-react";

const ITEMS_PER_PAGE = 5;

/* ── Status Badge ── */
function StatusBadge({ status }) {
  const config = {
    DRAFT: {
      bg: "var(--status-draft-bg)",
      text: "var(--status-draft-text)",
      dot: "var(--status-draft-dot)",
      label: "Draft",
    },
    SENT: {
      bg: "var(--status-sent-bg)",
      text: "var(--status-sent-text)",
      dot: "var(--status-sent-dot)",
      label: "Sent",
    },
    FORWARDED: {
      bg: "var(--status-fwd-bg)",
      text: "var(--status-fwd-text)",
      dot: "var(--status-fwd-dot)",
      label: "Forwarded",
    },
  };

  const c = config[status] || config.DRAFT;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold"
      style={{ background: c.bg, color: c.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.dot }} />
      {c.label}
    </span>
  );
}

/* ── Main Dashboard ── */
const EmployeeDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({ draft: 0, sent: 0, forwarded: 0 });
  const [rfps, setRfps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openRfpId, setOpenRfpId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/company/login");
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchData = async () => {
      try {
        const [statsRes, rfpsRes] = await Promise.all([
          getRFPStats(),
          getEmployeeRFPs(),
        ]);
        setStats({
          draft: statsRes.data.draft || 0,
          sent: statsRes.data.sent || 0,
          forwarded: statsRes.data.forwarded || 0,
        });
        setRfps(rfpsRes.data);
      } catch (error) {
        console.error("Dashboard Error:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalPages = Math.ceil(rfps.length / ITEMS_PER_PAGE);
  const currentRfps = rfps.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ── LOADING ── */
  if (loading) {
    return (
      <div style={{ background: "var(--bg-main)" }} className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-10">
          <div className="h-8 w-48 rounded-lg animate-shimmer mb-2" />
          <div className="h-5 w-72 rounded-lg animate-shimmer mb-10" />
          <div className="grid grid-cols-3 gap-5 mb-10">
            {[1,2,3].map(i => <div key={i} className="h-[110px] rounded-2xl animate-shimmer" />)}
          </div>
          {[1,2,3,4].map(i => <div key={i} className="h-[76px] rounded-xl animate-shimmer mb-3" />)}
        </main>
      </div>
    );
  }

  const statCards = [
    {
      label: "Draft RFPs",
      value: stats.draft,
      subtitle: "Pending completion",
      icon: FileText,
      bg: "var(--stat-1-bg)",
      border: "var(--stat-1-border)",
      accent: "var(--stat-1-accent)",
      accentBg: "var(--stat-1-accent-bg)",
      valueColor: "var(--stat-1-value)",
    },
    {
      label: "Sent RFPs",
      value: stats.sent,
      subtitle: "Awaiting vendor bids",
      icon: Send,
      bg: "var(--stat-2-bg)",
      border: "var(--stat-2-border)",
      accent: "var(--stat-2-accent)",
      accentBg: "var(--stat-2-accent-bg)",
      valueColor: "var(--stat-2-value)",
    },
    {
      label: "Forwarded",
      value: stats.forwarded,
      subtitle: "Sent to manager",
      icon: TrendingUp,
      bg: "var(--stat-3-bg)",
      border: "var(--stat-3-border)",
      accent: "var(--stat-3-accent)",
      accentBg: "var(--stat-3-accent-bg)",
      valueColor: "var(--stat-3-value)",
    },
  ];

  return (
    <div style={{ background: "var(--bg-main)" }}
      className="flex min-h-screen transition-colors duration-300">

      <Sidebar />

      <main className="flex-1 py-9 px-10">

        {/* ── HEADER ── */}
        <div className="flex justify-between items-start mb-9 animate-fadeIn">
          <div>
            <h1 style={{ color: "var(--text-primary)" }}
              className="text-2xl font-bold tracking-[-0.02em] mb-1">
              RFP Dashboard
            </h1>
            <p style={{ color: "var(--text-secondary)" }}
              className="text-sm">
              Manage your procurement requests efficiently
            </p>
          </div>

          <button
            onClick={() => navigate("/employee/create-rfp")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white
              transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
            style={{
              background: "var(--accent)",
              boxShadow: "0 2px 8px rgba(37, 99, 235, 0.25)",
            }}
          >
            <Plus size={16} strokeWidth={2.5} />
            New RFP
          </button>
        </div>

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-3 gap-5 mb-10">
          {statCards.map(({ label, value, subtitle, icon: Icon, bg, border, accent, accentBg, valueColor }, i) => (
            <div
              key={label}
              className="rounded-2xl p-6 transition-all duration-300 animate-fadeIn hover:translate-y-[-2px] hover:shadow-md cursor-default"
              style={{
                background: bg,
                border: `1px solid ${border}`,
                boxShadow: "var(--shadow-sm)",
                animationDelay: `${i * 100}ms`,
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: accentBg, color: accent }}
                >
                  <Icon size={18} strokeWidth={2} />
                </div>
              </div>
              <p style={{ color: valueColor }}
                className="text-3xl font-bold tracking-tight mb-1">
                {value}
              </p>
              <p style={{ color: "var(--text-secondary)" }}
                className="text-sm font-medium">
                {label}
              </p>
              <p style={{ color: "var(--text-muted)" }}
                className="text-xs mt-0.5">
                {subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* ── RFP LIST ── */}
        <div className="animate-fadeIn" style={{ animationDelay: "300ms" }}>

          <div className="flex justify-between items-center mb-5">
            <h2 style={{ color: "var(--text-primary)" }}
              className="text-base font-semibold">
              All Requests
            </h2>
            {rfps.length > 0 && (
              <span style={{ color: "var(--text-muted)" }}
                className="text-xs font-medium">
                {rfps.length} total · Page {currentPage} of {totalPages}
              </span>
            )}
          </div>

          {rfps.length === 0 ? (
            <div
              className="rounded-2xl py-16 text-center"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                boxShadow: "var(--shadow-xs)",
              }}
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center"
                style={{ background: "var(--accent-subtle)", color: "var(--accent-text)" }}>
                <FileText size={22} />
              </div>
              <p style={{ color: "var(--text-primary)" }}
                className="text-base font-semibold mb-1">No RFPs yet</p>
              <p style={{ color: "var(--text-muted)" }}
                className="text-sm mb-6">Create your first request to get started</p>
              <button
                onClick={() => navigate("/employee/create-rfp")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:brightness-110"
                style={{ background: "var(--accent)" }}
              >
                <Plus size={15} />
                Create RFP
              </button>
            </div>
          ) : (
            <>
              {/* RFP List */}
              <div className="space-y-3">
                {currentRfps.map((rfp, index) => (
                  <div
                    key={rfp._id}
                    onClick={() => {
                      if (rfp.status === "DRAFT") {
                        navigate(`/employee/create-rfp?draftId=${rfp._id}`);
                      } else if (rfp.status === "SENT") {
                        setOpenRfpId(rfp._id);
                      }
                    }}
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-color)",
                      boxShadow: "var(--shadow-xs)",
                    }}
                    className={`
                      rounded-xl px-5 py-4 flex items-center justify-between gap-4
                      transition-all duration-200 group
                      ${(rfp.status === "DRAFT" || rfp.status === "SENT")
                        ? "cursor-pointer hover:shadow-md hover:border-[var(--accent)]"
                        : ""
                      }
                    `}
                  >
                    {/* Left section */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          background: "var(--accent-subtle)",
                          color: "var(--accent-text)",
                        }}
                      >
                        <FileText size={18} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p style={{ color: "var(--text-primary)" }}
                          className="text-sm font-semibold truncate">
                          {rfp.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span style={{ color: "var(--text-muted)" }}
                            className="text-xs flex items-center gap-1">
                            <Clock size={11} />
                            {new Date(rfp.createdAt).toLocaleDateString("en-US", {
                              month: "short", day: "numeric", year: "numeric",
                            })}
                          </span>
                          {rfp.description && (
                            <>
                              <span style={{ color: "var(--border-color)" }}>·</span>
                              <span style={{ color: "var(--text-muted)" }}
                                className="text-xs truncate max-w-[300px]">
                                {rfp.description}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right section */}
                    <div className="flex items-center gap-3 shrink-0">
                      <StatusBadge status={rfp.status} />
                      {(rfp.status === "DRAFT" || rfp.status === "SENT") && (
                        <ArrowRight size={15}
                          style={{ color: "var(--text-muted)" }}
                          className="opacity-0 group-hover:opacity-100 transition-all duration-200" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-1.5 mt-8">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{
                      color: "var(--text-muted)",
                      border: "1px solid var(--border-color)",
                      background: "var(--bg-card)",
                    }}
                    className="w-9 h-9 rounded-lg flex items-center justify-center
                      disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 hover:bg-[var(--bg-hover)]"
                  >
                    <ChevronLeft size={15} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className="w-9 h-9 rounded-lg text-[13px] font-semibold transition-all duration-200"
                      style={
                        currentPage === page
                          ? {
                              background: "var(--accent)",
                              color: "#fff",
                              boxShadow: "0 2px 6px rgba(37, 99, 235, 0.25)",
                            }
                          : {
                              background: "var(--bg-card)",
                              color: "var(--text-secondary)",
                              border: "1px solid var(--border-color)",
                            }
                      }
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{
                      color: "var(--text-muted)",
                      border: "1px solid var(--border-color)",
                      background: "var(--bg-card)",
                    }}
                    className="w-9 h-9 rounded-lg flex items-center justify-center
                      disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 hover:bg-[var(--bg-hover)]"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {openRfpId && (
        <RfpQuickView rfpId={openRfpId} onClose={() => setOpenRfpId(null)} />
      )}
    </div>
  );
};

export default EmployeeDashboard;