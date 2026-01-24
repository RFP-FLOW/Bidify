import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEmployeeRFPs, getRFPStats } from "../../services/rfpService";

const EmployeeDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    draft: 0,
    sent: 0,
    closed: 0,
  });

  const [rfps, setRfps] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= AUTH GUARD ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/company/login");
    }
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
          closed: statsRes.data.closed || 0,
        });

        setRfps(rfpsRes.data);
      } catch (error) {
        console.error(
          "Dashboard Error:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#f6f7fb]">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-[#5b3df5] text-white flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold p-6">RFP Manager</h2>

          <nav className="flex flex-col gap-2 px-4">
            <button className="text-left px-4 py-2 rounded bg-white/20">
              Dashboard
            </button>
            <button
              onClick={() => navigate("/employee/create-rfp")}
              className="text-left px-4 py-2 rounded hover:bg-white/20"
            >
              Create RFP
            </button>
            <button className="text-left px-4 py-2 rounded hover:bg-white/20">
              Vendors
            </button>
          </nav>
        </div>

        <p className="text-sm p-6 text-white/80">
          Need Help? <br /> Check Documentation
        </p>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-8">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              RFP Dashboard
            </h1>
            <p className="text-gray-500">
              Manage your procurement requests efficiently
            </p>
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

          {/* Closed */}
          <div className="bg-[#e9fff1] rounded-xl p-6 flex justify-between items-center">
            <div>
              <p className="text-gray-600">Closed RFPs</p>
              <h2 className="text-2xl font-bold">{stats.closed}</h2>
            </div>
            <span className="text-2xl">✅</span>
          </div>
        </div>

        {/* ================= RFP LIST ================= */}
        <div>
          <h2 className="text-lg font-semibold mb-4">All RFPs</h2>

          {rfps.length === 0 ? (
            <p className="text-gray-500">No RFPs created yet</p>
          ) : (
            rfps.map((rfp) => (
              <div
                key={rfp._id}
                className="bg-white rounded-xl p-5 mb-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {rfp.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {rfp.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(rfp.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${
                      rfp.status === "DRAFT"
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
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
