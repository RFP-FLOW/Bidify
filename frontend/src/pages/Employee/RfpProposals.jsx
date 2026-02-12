import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Employee/SidebarEmployee";

const RfpProposals = () => {
  const { rfpId } = useParams();
  const [proposals, setProposals] = useState([]);
  const [rfpTitle, setRfpTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [aiResult, setAiResult] = useState(null);
const [aiLoading, setAiLoading] = useState(false);


  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/rfp/${rfpId}/proposals`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        setProposals(res.data.proposals);
        setRfpTitle(res.data.rfpTitle);
      } catch (err) {
        console.error("Fetch proposals error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [rfpId]);

  const handleAICompare = async () => {
  try {
    setAiLoading(true);

    const res = await axios.post(
      `http://localhost:5000/api/ai/recommend/${rfpId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

   setAiResult(res.data.recommendation);
  } catch (err) {
    console.error("AI compare error", err);
  } finally {
    setAiLoading(false);
  }
};

  return (
    <div className="flex min-h-screen bg-[#f6f7fb]">
      <Sidebar />

      <main className="flex-1 p-8">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">{rfpTitle}</h1>
          <p className="text-gray-500">Vendor Proposals</p>
        </div>

<button
  onClick={handleAICompare}
  disabled={proposals.length < 2}
  className="mb-6 px-6 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-50"
>
  🤖 Compare & Recommend using AI
</button>

{aiLoading && (
  <div className="bg-white p-4 rounded-lg shadow mb-4">
    🤖 AI is analyzing vendor proposals...
  </div>
)}

{aiResult && (
  <div className="bg-white p-6 rounded-xl shadow mb-6">
    <h2 className="text-lg font-bold mb-3">
      🏆 Top Recommendations
    </h2>

    {aiResult.topRecommendations?.map((vendor, index) => (
      <div
        key={index}
        className={`p-3 mb-2 rounded-lg ${
          index === 0 ? "bg-green-50 border border-green-300" : "bg-gray-50"
        }`}
      >
        <p className="font-semibold">
          {index + 1}. {vendor.vendor}
        </p>
        <p className="text-sm text-gray-600">
          {vendor.email}
        </p>
        <p className="text-sm font-semibold text-green-700">
          ₹{vendor.grandTotal}
        </p>
      </div>
    ))}

    <div className="mt-4">
      <h3 className="font-semibold mb-2">📊 Detailed Analysis</h3>

      {aiResult.vendorsAnalysis?.map((v, i) => (
        <div key={i} className="mb-3 p-3 bg-gray-50 rounded-lg">
          <p className="font-semibold">{v.vendor}</p>

          {v.itemBreakdown?.map((item, idx) => (
            <p key={idx} className="text-sm text-gray-600">
              {item.item} — ₹{item.totalItemPrice}
            </p>
          ))}

          <p className="text-sm">
            Delivery: ₹{v.deliveryCharge}
          </p>

          <p className="font-semibold text-purple-700">
            Grand Total: ₹{v.grandTotal}
          </p>
        </div>
      ))}
    </div>
  </div>
)}


        {loading && <p className="text-gray-500">Loading proposals...</p>}

        {!loading && proposals.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center text-gray-500 shadow-sm">
            <div className="text-4xl mb-3">📭</div>
            <p className="font-medium">No proposals received yet</p>
            <p className="text-sm mt-1">
              Proposals will appear here once vendors respond.
            </p>
          </div>
        )}

        {/* PROPOSALS LIST */}
        {!loading &&
          proposals.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-xl p-6 mb-5 shadow-sm hover:shadow-md transition"
            >
              {/* TOP ROW */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {p.vendorId?.name}
                  </h3>
                  <p className="text-sm text-gray-500">{p.vendorId?.email}</p>
                </div>

                {p.quotedPrice && (
                  <span className="px-4 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                    ₹{p.quotedPrice}
                  </span>
                )}
              </div>

              {/* MESSAGE */}
              <div className="mt-4 bg-gray-50 p-4 rounded-lg text-gray-700 text-sm leading-relaxed">
                {p.message}
              </div>
              {/* ATTACHMENT */}
              {p.attachment && (
                <div className="mt-3">
                  <a
                    href={p.attachment}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
                  >
                    📎 View Attachment
                  </a>
                </div>
              )}

              {/* FOOTER */}
              <div className="mt-3 text-xs text-gray-400">
                Received on {new Date(p.updatedAt).toLocaleString()}
              </div>
            </div>
          ))}
      </main>
    </div>
  );
};

export default RfpProposals;
