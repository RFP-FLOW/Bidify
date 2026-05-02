import { useEffect, useState } from "react";
import axios from "axios";
import ManagerLayout from "../../components/Manager/SidebarCardManager";

function ManagerRecommendations() {
  const [rfps, setRfps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchForwardedRFPs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/rfp/forwarded", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
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
      {!selected ? (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Employee Recommendations
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              RFPs forwarded to you by employees with AI vendor recommendations
            </p>
          </div>

          {loading && (
            <p className="text-gray-400 text-sm py-12 text-center">Loading...</p>
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
        </>
      ) : (
        <DetailView rfp={selected} onBack={() => setSelected(null)} />
      )}
    </ManagerLayout>
  );
}

/* ── RFP CARD WITH VENDOR PREVIEW ─────────────────────────── */
function RFPCard({ rfp, onView }) {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchPreview = async () => {
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
        setPreview(res.data.recommendation);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPreview();
  }, [rfp._id]);

  const top2 = preview?.topRecommendations?.slice(0, 2) || [];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5">
      {/* TOP ROW */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="font-semibold text-gray-800 text-base">{rfp.title}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Forwarded by{" "}
            <span className="text-gray-600 font-medium">{rfp.createdBy?.name}</span>
            {" · "}
            {new Date(rfp.updatedAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        <span className="text-xs font-semibold bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
          FORWARDED
        </span>
      </div>

      {/* VENDOR PREVIEW */}
      {!preview && (
        <p className="text-xs text-gray-300 mb-3">Loading vendors...</p>
      )}

      {top2.length > 0 && (
        <div className="flex gap-3 mb-4">
          {top2.map((vendor, index) => (
            <div
              key={index}
              className={`flex-1 rounded-xl p-3 border-l-4 ${
                index === 0
                  ? "bg-green-50 border-green-400"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <p
                className={`text-xs font-semibold mb-1 ${
                  index === 0 ? "text-green-700" : "text-gray-400"
                }`}
              >
                #{index + 1} {index === 0 ? "Best" : ""}
              </p>
              <p className="text-sm font-semibold text-gray-800 truncate">
                {vendor.vendor}
              </p>
              <p
                className={`text-sm font-semibold mt-1 ${
                  index === 0 ? "text-green-700" : "text-gray-600"
                }`}
              >
                ₹{Number(vendor.grandTotal).toLocaleString("en-IN")}
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

/* ── DETAIL VIEW ───────────────────────────────────────────── */
function DetailView({ rfp, onBack }) {
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
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
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [rfp._id]);

  const top3 = aiData?.topRecommendations?.slice(0, 3) || [];
  const analysisMap = {};
  aiData?.vendorsAnalysis?.forEach((v) => { analysisMap[v.vendor] = v; });

  const borderColors = ["border-green-400", "border-blue-400", "border-orange-300"];
  const rankBg = ["bg-green-500", "bg-blue-500", "bg-orange-400"];

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
          <span className="font-medium text-gray-600">{rfp.createdBy?.name}</span>{" "}
          ({rfp.createdBy?.email})
        </p>
      </div>

      {loading && (
        <p className="text-gray-400 text-sm py-12 text-center">
          Loading AI recommendations...
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
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${rankBg[index]}`}
                  >
                    #{index + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-800">{vendor.vendor}</p>
                    <p className="text-xs text-gray-400">{vendor.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">
                    ₹{Number(vendor.grandTotal).toLocaleString("en-IN")}
                  </p>
                  {vendor.deliveryDays && (
                    <p className="text-xs text-gray-400">
                      {vendor.deliveryDays} days delivery
                    </p>
                  )}
                </div>
              </div>

              {analysis.itemBreakdown?.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-gray-400 text-xs">
                        <th className="text-left px-3 py-2 rounded-tl-lg font-medium">Item</th>
                        <th className="text-center px-3 py-2 font-medium">Qty</th>
                        <th className="text-right px-3 py-2 font-medium">Unit price</th>
                        <th className="text-right px-3 py-2 rounded-tr-lg font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.itemBreakdown.map((item, idx) => (
                        <tr key={idx} className="border-t border-gray-50 text-gray-600">
                          <td className="px-3 py-2">{item.item}</td>
                          <td className="px-3 py-2 text-center">{item.quantity ?? "—"}</td>
                          <td className="px-3 py-2 text-right">
                            {item.unitPrice
                              ? `₹${Number(item.unitPrice).toLocaleString("en-IN")}`
                              : "—"}
                          </td>
                          <td className="px-3 py-2 text-right font-medium">
                            ₹{Number(item.totalItemPrice).toLocaleString("en-IN")}
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
                            ₹{Number(analysis.deliveryCharge).toLocaleString("en-IN")}
                          </td>
                        </tr>
                      )}
                      <tr className="border-t-2 border-gray-200 font-bold text-gray-800 text-sm">
                        <td colSpan={3} className="px-3 py-2 text-right">
                          Grand total
                        </td>
                        <td className="px-3 py-2 text-right text-green-600">
                          ₹{Number(
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
    </div>
  );
}

export default ManagerRecommendations;
