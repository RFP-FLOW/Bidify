import { useEffect, useState } from "react";
import axios from "axios";
import ManagerLayout from "../../components/Manager/SidebarCardManager";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days — must match backend

const fmt = (n) => Number(n || 0).toLocaleString("en-IN");
const dateStr = (d) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// Returns true if the rfp's cache is still valid
const isCacheValid = (rfp) =>
  rfp.aiRecommendationCache &&
  rfp.aiRecommendationCachedAt &&
  Date.now() - new Date(rfp.aiRecommendationCachedAt).getTime() < CACHE_TTL_MS;

// ─── main page ────────────────────────────────────────────────────────────────
function ManagerRecommendations() {
  const [rfps, setRfps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/rfp/forwarded", {
        headers: authHeader(),
      })
      .then((res) => setRfps(res.data.rfps || []))
      .catch((err) => console.error("Failed to fetch forwarded RFPs", err))
      .finally(() => setLoading(false));
  }, []);

  if (selected) {
    return (
      <ManagerLayout>
        <DetailView rfp={selected} onBack={() => setSelected(null)} />
      </ManagerLayout>
    );
  }

  return (
    <ManagerLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Employee Recommendations
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          RFPs forwarded to you by employees with AI vendor recommendations
        </p>
      </div>

      {loading && (
        <p className="text-gray-400 text-sm py-12 text-center">Loading…</p>
      )}

      {!loading && rfps.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <p className="text-gray-400 text-sm mt-2">
            No recommendations yet. When an employee forwards vendor
            recommendations, they'll appear here.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {rfps.map((rfp) => (
          <RFPCard key={rfp._id} rfp={rfp} onView={() => setSelected(rfp)} />
        ))}
      </div>
    </ManagerLayout>
  );
}

// ─── card ─────────────────────────────────────────────────────────────────────
// If cache is valid  → shows vendor names instantly (no API call)
// If cache expired   → calls /api/ai/recommend to refresh, then shows
function RFPCard({ rfp, onView }) {
  const [aiData, setAiData] = useState(
    isCacheValid(rfp) ? rfp.aiRecommendationCache : null
  );
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Cache still good — nothing to do
    if (isCacheValid(rfp)) return;

    // Cache missing or expired — call AI to refresh
    setRefreshing(true);
    axios
      .post(
        `http://localhost:5000/api/ai/recommend/${rfp._id}`,
        {},
        { headers: authHeader() }
      )
      .then((res) => setAiData(res.data.recommendation))
      .catch((err) => console.error("AI refresh failed", err))
      .finally(() => setRefreshing(false));
  }, [rfp._id]);

  const top2 = aiData?.topRecommendations?.slice(0, 2) || [];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5">
      {/* top row */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="font-semibold text-gray-800 text-base">{rfp.title}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Forwarded by{" "}
            <span className="text-gray-600 font-medium">
              {rfp.createdBy?.name}
            </span>{" "}
            · {dateStr(rfp.updatedAt)}
          </p>
        </div>
        <span className="text-xs font-semibold bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
          FORWARDED
        </span>
      </div>

      {/* vendor preview */}
      {refreshing && (
        <p className="text-xs text-gray-300 mb-3">Refreshing AI analysis…</p>
      )}
      {!refreshing && top2.length === 0 && (
        <p className="text-xs text-gray-300 mb-3">No AI data available</p>
      )}
      {top2.length > 0 && (
        <div className="flex gap-3 mb-4">
          {top2.map((vendor, i) => (
            <div
              key={i}
              className={`flex-1 rounded-xl p-3 border-l-4 ${i === 0
                  ? "bg-green-50 border-green-400"
                  : "bg-gray-50 border-gray-200"
                }`}
            >
              <p
                className={`text-xs font-semibold mb-1 ${i === 0 ? "text-green-700" : "text-gray-400"
                  }`}
              >
                #{i + 1} {i === 0 ? "Best" : ""}
              </p>
              <p className="text-sm font-semibold text-gray-800 truncate">
                {vendor.vendor}
              </p>
              <p
                className={`text-sm font-semibold mt-1 ${i === 0 ? "text-green-700" : "text-gray-600"
                  }`}
              >
                ₹{fmt(vendor.grandTotal)}
              </p>
              {vendor.deliveryDays && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {vendor.deliveryDays} days
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onView}
        className="w-full py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition font-medium"
      >
        View full analysis →
      </button>
    </div>
  );
}

// ─── detail view ──────────────────────────────────────────────────────────────
// Same logic: instant if cache valid, refreshes from AI if expired
function DetailView({ rfp, onBack }) {
  const [aiData, setAiData] = useState(
    isCacheValid(rfp) ? rfp.aiRecommendationCache : null
  );
  const [loading, setLoading] = useState(!isCacheValid(rfp));

  // 🔴 ADDED: state for approval
  const [approvedId, setApprovedId] = useState(null);

  useEffect(() => {
    if (isCacheValid(rfp)) return;

    setLoading(true);
    axios
      .post(
        `http://localhost:5000/api/ai/recommend/${rfp._id}`,
        {},
        { headers: authHeader() }
      )
      .then((res) => setAiData(res.data.recommendation))
      .catch((err) => console.error("AI refresh failed", err))
      .finally(() => setLoading(false));
  }, [rfp._id]);

  // 🔴 ADDED: approve function
  const handleApprove = async (proposalId) => {
  try {
    const res = await axios.patch(
      `http://localhost:5000/api/rfp/proposal/approve/${proposalId}`,
      {},
      { headers: authHeader() }
    );

    if (res.data.success) {

      // update local UI instantly
      setAiData((prev) => {
        const updated = { ...prev };

        updated.topRecommendations =
          updated.topRecommendations.map((v) => ({
            ...v,
            status:
              v.proposalId === proposalId
                ? "ACCEPTED"
                : "REJECTED",
          }));

        updated.vendorsAnalysis =
          updated.vendorsAnalysis.map((v) => ({
            ...v,
            status:
              v.proposalId === proposalId
                ? "ACCEPTED"
                : "REJECTED",
          }));

        return updated;
      });

      setApprovedId(proposalId);

      toast.success("Vendor Approved Successfully ✅");
    } else {
      toast.error(res.data.message);
    }
  } catch (err) {
    console.error(err);

    toast.error("Failed to approve vendor ❌");
  }
};

  const uniqueRecommendations = [];
  const seen = new Set();

  (aiData?.topRecommendations || []).forEach((vendor) => {
    const key = vendor.email;

    if (!seen.has(key)) {
      seen.add(key);
      uniqueRecommendations.push(vendor);
    }
  });

  const top3 = uniqueRecommendations.slice(0, 3);
  const analysisMap = {};
  aiData?.vendorsAnalysis?.forEach((v) => {
    analysisMap[v.vendor] = v;
  });

  const borderColors = [
    "border-green-400",
    "border-blue-400",
    "border-orange-300",
  ];
  const rankBg = ["bg-green-500", "bg-blue-500", "bg-orange-400"];
  console.log("TOP3 DATA:", top3);
  return (
    <div>
      <button
        onClick={onBack}
        className="text-sm text-purple-600 hover:underline mb-5 flex items-center gap-1"
      >
        ← Back to Recommendations
      </button>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">{rfp.title}</h2>
        <p className="text-sm text-gray-400 mt-1">
          Forwarded by{" "}
          <span className="font-medium text-gray-600">
            {rfp.createdBy?.name}
          </span>{" "}
          ({rfp.createdBy?.email})
        </p>
      </div>

      {loading && (
        <p className="text-gray-400 text-sm py-12 text-center">
          Cache expired — refreshing AI analysis…
        </p>
      )}

      {!loading && top3.length === 0 && (
        <p className="text-gray-400 text-sm py-12 text-center">
          No AI analysis available for this RFP.
        </p>
      )}

      <div className="space-y-4">
        {top3.map((vendor, index) => {
          const analysis = analysisMap[vendor.vendor] || {};
          return (
            <div
              key={index}
              className={`bg-white rounded-2xl p-5 border border-gray-100 border-l-4 ${borderColors[index]}`}
            >
              {/* vendor header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${rankBg[index]}`}
                  >
                    #{index + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {vendor.vendor}
                    </p>
                    <p className="text-xs text-gray-400">{vendor.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">
                    ₹{fmt(vendor.grandTotal)}
                  </p>
                  {vendor.deliveryDays !== undefined && (
                    <p className="text-xs text-gray-400">
                      {vendor.deliveryDays} days delivery
                    </p>

                  )}
                  {vendor.status === "ACCEPTED" && (
                    <p className="text-green-600 font-semibold text-sm mt-1">
                      Approved ✅
                    </p>
                  )}

                  {vendor.status === "REJECTED" && (
                    <p className="text-red-500 font-semibold text-sm mt-1">
                      Rejected ❌
                    </p>
                  )}
                </div>
              </div>

              {/* AI reason */}
              {analysis.reason && (
                <div className="mb-4 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-xs text-amber-800">
                  💡 {analysis.reason}
                </div>
              )}

              {/* item breakdown table */}
              {analysis.itemBreakdown?.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-gray-400 text-xs">
                        <th className="text-left px-3 py-2 rounded-tl-lg font-medium">
                          Item
                        </th>

                        <th className="text-center px-3 py-2 font-medium">
                          Qty
                        </th>

                        <th className="text-right px-3 py-2 font-medium">
                          Unit price
                        </th>

                        <th className="text-right px-3 py-2 rounded-tr-lg font-medium">
                          Total
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {analysis.itemBreakdown.map((item, idx) => (
                        <tr
                          key={idx}
                          className="border-t border-gray-50 text-gray-600"
                        >
                          <td className="px-3 py-2">{item.item}</td>

                          <td className="px-3 py-2 text-center">
                            {item.quantity ?? "—"}
                          </td>

                          <td className="px-3 py-2 text-right">
                            {item.unitPrice
                              ? `₹${fmt(item.unitPrice)}`
                              : "—"}
                          </td>

                          <td className="px-3 py-2 text-right font-medium">
                            ₹{fmt(item.totalItemPrice)}
                          </td>
                        </tr>
                      ))}
                    </tbody>

                    <tfoot>
                      {analysis.deliveryCharge !== undefined && (
                        <tr className="border-t border-gray-100 text-gray-400 text-xs">
                          <td colSpan={3} className="px-3 py-2 text-right">
                            Delivery charges
                          </td>

                          <td className="px-3 py-2 text-right">
                            ₹{fmt(analysis.deliveryCharge)}
                          </td>
                        </tr>
                      )}

                      <tr className="border-t-2 border-gray-200 font-bold text-gray-800 text-sm">
                        <td colSpan={3} className="px-3 py-2 text-right">
                          Grand total
                        </td>

                        <td className="px-3 py-2 text-right text-green-600">
                          ₹{fmt(analysis.grandTotal || vendor.grandTotal)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}

              {/* VIEW FILE */}
             {vendor.attachment && (
  <div className="mt-4">
    <a
      href={vendor.attachment}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
    >
      📄 View Proposal File
    </a>
  </div>
)}


              {/* 🔴 ADDED: approve button (NO UI disturbed) */}
              {vendor.status === "PENDING" && (
                <button
                  onClick={() => handleApprove(vendor.proposalId)}
                  className="mt-4 px-4 py-2 rounded-lg text-sm bg-green-600 text-white hover:bg-green-700"
                >
                  {approvedId === vendor.proposalId
                    ? "Approved ✅"
                    : "Approve"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ManagerRecommendations;
