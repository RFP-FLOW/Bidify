import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Employee/SidebarEmployee";

const ForwardToManager = () => {
  const { rfpId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // aiResult can be passed via navigate state OR fetched fresh
  const [aiResult, setAiResult] = useState(location.state?.aiResult || null);
  const [rfpTitle, setRfpTitle] = useState(location.state?.rfpTitle || "");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(!aiResult);
  const [error, setError] = useState("");
  const [managerInfo, setManagerInfo] = useState(null);

  // If page is opened directly (no state), fetch AI result fresh
  useEffect(() => {
    if (aiResult) return;
    const fetchAndRecommend = async () => {
      try {
        setLoading(true);
        // fetch rfp title
        const rfpRes = await axios.get(`http://localhost:5000/api/rfp/${rfpId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setRfpTitle(rfpRes.data.title || "");

        // run ai
        const aiRes = await axios.post(
          `http://localhost:5000/api/ai/recommend/${rfpId}`,
          {},
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        setAiResult(aiRes.data.recommendation);
      } catch (err) {
        setError("Could not load AI recommendations. Please go back and run the AI comparison first.");
      } finally {
        setLoading(false);
      }
    };
    fetchAndRecommend();
  }, [rfpId]);

  const handleForward = async () => {
    if (!note.trim()) {
      setError("Please add a note to the manager before forwarding.");
      return;
    }
    setError("");
    try {
      setSending(true);
      await axios.post(
        `http://localhost:5000/api/rfp/${rfpId}/forward-to-manager`,
        {
          note,
          aiResult,
          rfpTitle,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setManagerInfo({ name: res.data.managerName, email: res.data.managerEmail });
      setSent(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to forward. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  const top3 = aiResult?.topRecommendations?.slice(0, 3) || [];
  const analysisMap = {};
  aiResult?.vendorsAnalysis?.forEach((v) => {
    analysisMap[v.vendor] = v;
  });

  return (
    <div className="flex min-h-screen bg-[#f6f7fb]">
      <Sidebar />

      <main className="flex-1 p-8 max-w-4xl">
        {/* HEADER */}
        <div className="mb-2">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-purple-600 hover:underline flex items-center gap-1 mb-4"
          >
            ← Back to Proposals
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Forward to Manager
          </h1>
          {rfpTitle && (
            <p className="text-gray-500 mt-1">
              RFP: <span className="font-medium text-gray-700">{rfpTitle}</span>
            </p>
          )}
        </div>

        {/* LOADING */}
        {loading && (
          <div className="bg-white rounded-xl p-8 text-center text-gray-400 shadow-sm mt-6">
            <div className="text-3xl mb-2">🤖</div>
            <p>Loading AI recommendations...</p>
          </div>
        )}

        {/* SUCCESS STATE */}
        {sent && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center shadow-sm mt-6">
            <div className="text-4xl mb-3">✅</div>
            <h2 className="text-xl font-bold text-green-700 mb-1">
              Forwarded Successfully!
            </h2>
           <p className="text-green-600 text-sm">
  Email sent to{" "}
  <span className="font-semibold">{managerInfo?.name}</span>
  {" "}({managerInfo?.email})
</p>
            <button
              onClick={() => navigate("/employee/dashboard")}
              className="mt-5 px-6 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {/* MAIN CONTENT */}
        {!loading && !sent && aiResult && (
          <>
            {/* TOP 3 VENDOR CARDS */}
            <div className="mt-6">
              <h2 className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
                🏆 Top Vendor Recommendations{" "}
                <span className="text-xs font-normal text-gray-400">
                  (will be included in the email)
                </span>
              </h2>

              <div className="space-y-3">
                {top3.map((vendor, index) => {
                  const analysis = analysisMap[vendor.vendor];
                  return (
                    <div
                      key={index}
                      className={`bg-white rounded-xl p-5 shadow-sm border-l-4 ${
                        index === 0
                          ? "border-green-400"
                          : index === 1
                          ? "border-blue-400"
                          : "border-orange-300"
                      }`}
                    >
                      {/* Rank badge + name */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                              index === 0
                                ? "bg-green-500"
                                : index === 1
                                ? "bg-blue-500"
                                : "bg-orange-400"
                            }`}
                          >
                            #{index + 1}
                          </span>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {vendor.vendor}
                            </p>
                            <p className="text-xs text-gray-500">
                              {vendor.email}
                            </p>
                          </div>
                        </div>
                        <span className="text-base font-bold text-green-600">
                          ₹{Number(vendor.grandTotal).toLocaleString("en-IN")}
                        </span>
                      </div>

                      {/* Details row */}
                      {analysis && (
                        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                          {analysis.deliveryDays && (
                            <div className="bg-gray-50 rounded-lg px-3 py-2">
                              <p className="text-gray-400 text-xs">
                                Delivery Time
                              </p>
                              <p className="font-semibold text-gray-700">
                                {analysis.deliveryDays} days
                              </p>
                            </div>
                          )}
                          {analysis.deliveryCharge !== undefined && (
                            <div className="bg-gray-50 rounded-lg px-3 py-2">
                              <p className="text-gray-400 text-xs">
                                Delivery Charge
                              </p>
                              <p className="font-semibold text-gray-700">
                                ₹
                                {Number(
                                  analysis.deliveryCharge
                                ).toLocaleString("en-IN")}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Item breakdown */}
                      {analysis?.itemBreakdown?.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs text-gray-400 mb-1">
                            Item Breakdown
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {analysis.itemBreakdown.map((item, idx) => (
                              <span
                                key={idx}
                                className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-full"
                              >
                                {item.item} — ₹
                                {Number(item.totalItemPrice).toLocaleString(
                                  "en-IN"
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* AI reason */}
                      {analysis?.reason && (
                        <div className="mt-3 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 text-xs text-amber-800">
                          💡 {analysis.reason}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* NOTE TO MANAGER */}
            <div className="mt-6 bg-white rounded-xl p-5 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📝 Your Note to Manager{" "}
                <span className="text-red-400">*</span>
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={5}
                placeholder="e.g. Based on the AI analysis, Vendor A offers the best price-to-delivery ratio. I recommend shortlisting them. Please review and approve."
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-300"
              />
              <p className="text-xs text-gray-400 mt-1">
                This message will appear in the email sent to your manager.
              </p>
            </div>

            {/* ERROR */}
            {error && (
              <div className="mt-3 text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-2">
                ⚠️ {error}
              </div>
            )}

            {/* FORWARD BUTTON */}
            <div className="mt-5 flex items-center gap-4">
              <button
                onClick={handleForward}
                disabled={sending}
                className="px-7 py-3 bg-purple-600 text-white rounded-xl font-semibold text-sm hover:bg-purple-700 disabled:opacity-60 shadow-sm transition"
              >
                {sending ? "Sending..." : "📤 Forward to Manager"}
              </button>
              <button
                onClick={() => navigate(-1)}
                className="px-5 py-3 text-gray-500 text-sm hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {/* ERROR with no aiResult */}
        {!loading && !sent && !aiResult && error && (
          <div className="mt-6 text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
            ⚠️ {error}
          </div>
        )}
      </main>
    </div>
  );
};

export default ForwardToManager;
