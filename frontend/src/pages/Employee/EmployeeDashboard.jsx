import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEmployeeRFPs, getRFPStats } from "../../services/rfpService";
import Sidebar from "../../components/Employee/SidebarEmployee";
import RfpQuickView from "./RfpQuickView";

// ============================================================
// Ek page pe kitne RFPs dikhane hain
// ============================================================
const ITEMS_PER_PAGE = 5;

const EmployeeDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({ draft: 0, sent: 0, forwarded: 0 });
  const [rfps, setRfps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openRfpId, setOpenRfpId] = useState(null);

  // ── Pagination state ──────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);

  /* ================= AUTH GUARD ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/company/login");
  }, [navigate]);

  /* ================= FETCH DASHBOARD DATA ================= */
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

  // ============================================================
  // Pagination calculations
  // totalPages  = kitne pages banenge total RFPs se
  // currentRfps = sirf current page ke RFPs (slice se)
  // ============================================================
  const totalPages = Math.ceil(rfps.length / ITEMS_PER_PAGE);
  const currentRfps = rfps.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Page change handler — boundary check ke saath
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    // Page change pe smooth scroll up
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#f6f7fb]">
      {/* ================= SIDEBAR ================= */}
      <Sidebar />

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-8">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">RFP Dashboard</h1>
            <p className="text-gray-500">Manage your procurement requests efficiently</p>
          </div>
          <button
            onClick={() => navigate("/employee/create-rfp")}
            className="bg-[#5b3df5] text-white px-5 py-2 rounded-lg shadow hover:bg-[#4a2ee0]"
          >
            Create New RFP
          </button>
        </div>

        {/* ================= STATS CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Draft */}
          <div className="bg-[#fff3df] rounded-xl p-6 flex justify-between items-center">
            <div>
              <p className="text-gray-600">Draft RFPs</p>
              <h2 className="text-2xl font-bold">{stats.draft}</h2>
            </div>
            <span className="text-2xl">⏳</span>
          </div>

          {/* Sent */}
          <div className="bg-[#eef4ff] rounded-xl p-6 flex justify-between items-center">
            <div>
              <p className="text-gray-600">Sent RFPs</p>
              <h2 className="text-2xl font-bold">{stats.sent}</h2>
            </div>
            <span className="text-2xl">📨</span>
          </div>

          {/* Forwarded to Manager */}
          <div className="bg-[#e9fff1] rounded-xl p-6 flex justify-between items-center">
            <div>
              <p className="text-gray-600">Sent to Manager</p>
              <h2 className="text-2xl font-bold">{stats.forwarded}</h2>
            </div>
            <span className="text-2xl">📋</span>
          </div>
        </div>

        {/* ================= RFP LIST ================= */}
        <div>
          {/* Header — RFP count bhi dikhao */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">All RFPs</h2>
            {rfps.length > 0 && (
              <span className="text-sm text-gray-400">
                {rfps.length} total • Page {currentPage} of {totalPages}
              </span>
            )}
          </div>

          {rfps.length === 0 ? (
            <p className="text-gray-500">No RFPs created yet</p>
          ) : (
            <>
              {/* ── Current page ke RFPs ── */}
              {currentRfps.map((rfp) => (
                <div
                  key={rfp._id}
                  onClick={() => {
                    if (rfp.status === "DRAFT") {
                      navigate(`/employee/create-rfp?draftId=${rfp._id}`);
                    } else if (rfp.status === "SENT") {
                      setOpenRfpId(rfp._id);
                    }
                  }}
                  className={`bg-white rounded-xl p-5 mb-4 flex justify-between items-center
                    ${rfp.status === "DRAFT" ? "cursor-pointer hover:bg-gray-50" : ""}
                  `}
                >
                  <div>
                    <h3 className="font-semibold text-gray-800">{rfp.title}</h3>
                    <p className="text-sm text-gray-500">{rfp.description}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(rfp.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${rfp.status === "DRAFT"
                        ? "bg-yellow-100 text-yellow-700"
                        : rfp.status === "SENT"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                      }
                    `}
                  >
                    {rfp.status}
                  </span>
                </div>
              ))}

              {/* ============================================================
                  PAGINATION BAR
                  Sirf tab dikhao jab 1 se zyada page ho
              ============================================================ */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">

                  {/* ← Prev button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg text-sm font-medium
                      bg-white border border-gray-200 text-gray-600
                      hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed
                      transition-all"
                  >
                    ← Prev
                  </button>

                  {/* Page number buttons */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-all
                        ${currentPage === page
                          ? "bg-[#5b3df5] text-white shadow"        // active page
                          : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50" // inactive
                        }
                      `}
                    >
                      {page}
                    </button>
                  ))}

                  {/* Next → button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg text-sm font-medium
                      bg-white border border-gray-200 text-gray-600
                      hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed
                      transition-all"
                  >
                    Next →
                  </button>

                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* ================= RFP QUICK VIEW MODAL ================= */}
      {openRfpId && (
        <RfpQuickView
          rfpId={openRfpId}
          onClose={() => setOpenRfpId(null)}
        />
      )}
    </div>
  );
};

export default EmployeeDashboard;