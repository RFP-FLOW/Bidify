import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ManagerLayout from "../../components/Manager/SidebarCardManager";

function ManagerRecommendations() {
  const [rfps, setRfps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null); // selected RFP for detail view
  const navigate = useNavigate();

  useEffect(() => {
    const fetchForwardedRFPs = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/rfp/forwarded",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setRfps(res.data.rfps || []);
      } catch (err) {
        console.error("Failed to fetch forwarded RFPs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchForwardedRFPs();
  }, []);

  return (
    <ManagerLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          📋 Employee Recommendations
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          RFPs forwarded to you by employees with AI vendor recommendations
        </p>
      </div>

      {loading && (
        <div className="text-center text-gray-400 py-16">
          Loading recommendations...
        </div>
      )}

      {!loading && rfps.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm">
          <div className="text-4xl mb-3">📭</div>
          <p className="font-medium text-gray-600">No recommendations yet</p>
          <p className="text-sm text-gray-400 mt-1">
            When an employee forwards vendor recommendations, they'll appear here.
          </p>
        </div>
      )}

      {/* RFP LIST */}
      {!loading && rfps.length > 0 && !selected && (
        <div className="space-y-4">
          {rfps.map((rfp) => (
            <div
              key={rfp._id}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer"
              onClick={() => setSelected(rfp)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-gray-800 text-base">
                    {rfp.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Forwarded by{" "}
                    <span className="font-medium text-gray-700">
                      {rfp.createdBy?.name}
                    </span>{" "}
                    · {rfp.createdBy?.email}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(rfp.updatedAt).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                    FORWARDED
                  </span>
                  <button className="px-4 py-2 bg-[#3a2d97] text-white text-sm rounded-lg hover:bg-[#2e2478]">
                    View →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAIL VIEW */}
      {selected && (
        <DetailView rfp={selected} onBack={() => setSelected(null)} />
      )}
    </ManagerLayout>
  );
}

/* ── DETAIL VIEW ───────────────────────────────────────── */
function DetailView({ rfp, onBack }) {
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const res = await axios.post(
          `http://localhost:5000/api/ai/recommend/${rfp._id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setAiData(res.data.recommendation);
      } catch (err) {
        console.error("Failed to fetch AI recommendation", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendation();
  }, [rfp._id]);

  const top3 = aiData?.topRecommendations?.slice(0, 3) || [];
  const analysisMap = {};
  aiData?.vendorsAnalysis?.forEach((v) => {
    analysisMap[v.vendor] = v;
  });

  const rankColors = ["#22c55e", "#3b82f6", "#f97316"];
  const rankBg = ["bg-green-500", "bg-blue-500", "bg-orange-400"];
  const borderColors = [
    "border-green-400",
    "border-blue-400",
    "border-orange-300",
  ];

  return (
    <div>
      {/* BACK + HEADER */}
      <button
        onClick={onBack}
        className="text-sm text-purple-600 hover:underline mb-4 flex items-center gap-1"
      >
        ← Back to Recommendations
      </button>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">{rfp.title}</h2>
        <p className="text-sm text-gray-500 mt-1">
          Forwarded by{" "}
          <span className="font-medium text-gray-700">{rfp.createdBy?.name}</span>{" "}
          ({rfp.createdBy?.email})
        </p>
      </div>

      {loading && (
        <div className="text-center text-gray-400 py-12">
          🤖 Loading AI recommendations...
        </div>
      )}

      {!loading && top3.length === 0 && (
        <div className="bg-white rounded-xl p-8 text-center text-gray-400 shadow-sm">
          No AI recommendation data found.
        </div>
      )}

      {!loading && top3.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700 text-base mb-2">
            🏆 Top Vendor Recommendations
          </h3>

          {top3.map((vendor, index) => {
            const analysis = analysisMap[vendor.vendor] || {};
            return (
              <div
                key={index}
                className={`bg-white rounded-xl p-5 shadow-sm border-l-4 ${borderColors[index]}`}
              >
                {/* TOP ROW */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${rankBg[index]}`}
                    >
                      #{index + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {vendor.vendor}
                      </p>
                      <p className="text-xs text-gray-500">{vendor.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      ₹{Number(vendor.grandTotal).toLocaleString("en-IN")}
                    </p>
                    {vendor.deliveryDays && (
                      <p className="text-xs text-gray-400">
                        🚚 {vendor.deliveryDays} days delivery
                      </p>
                    )}
                  </div>
                </div>

                {/* ITEM TABLE */}
                {analysis.itemBreakdown?.length > 0 && (
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 text-gray-500 text-xs">
                          <th className="text-left px-3 py-2 rounded-tl-lg">
                            Item
                          </th>
                          <th className="text-center px-3 py-2">Qty</th>
                          <th className="text-right px-3 py-2">Unit Price</th>
                          <th className="text-right px-3 py-2 rounded-tr-lg">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {analysis.itemBreakdown.map((item, idx) => (
                          <tr
                            key={idx}
                            className="border-t border-gray-100 text-gray-700"
                          >
                            <td className="px-3 py-2">{item.item}</td>
                            <td className="px-3 py-2 text-center">
                              {item.quantity ?? "—"}
                            </td>
                            <td className="px-3 py-2 text-right">
                              {item.unitPrice
                                ? `₹${Number(item.unitPrice).toLocaleString(
                                    "en-IN"
                                  )}`
                                : "—"}
                            </td>
                            <td className="px-3 py-2 text-right font-medium">
                              ₹
                              {Number(item.totalItemPrice).toLocaleString(
                                "en-IN"
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        {analysis.deliveryCharge !== undefined && (
                          <tr className="border-t border-gray-200 text-gray-500 text-xs">
                            <td
                              colSpan={3}
                              className="px-3 py-2 text-right"
                            >
                              Delivery Charges
                            </td>
                            <td className="px-3 py-2 text-right">
                              ₹
                              {Number(
                                analysis.deliveryCharge
                              ).toLocaleString("en-IN")}
                            </td>
                          </tr>
                        )}
                        <tr className="border-t-2 border-gray-300 font-bold text-gray-800 text-sm">
                          <td colSpan={3} className="px-3 py-2 text-right">
                            Grand Total
                          </td>
                          <td className="px-3 py-2 text-right text-green-600">
                            ₹
                            {Number(
                              analysis.grandTotal || vendor.grandTotal
                            ).toLocaleString("en-IN")}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ManagerRecommendations;
