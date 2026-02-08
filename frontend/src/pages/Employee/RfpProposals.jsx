import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Employee/SidebarEmployee";

const RfpProposals = () => {
  const { rfpId } = useParams();
  const [proposals, setProposals] = useState([]);
  const [rfpTitle, setRfpTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/rfp/${rfpId}/proposals`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
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

 return (
  <div className="flex min-h-screen bg-[#f6f7fb]">
    <Sidebar />

    <main className="flex-1 p-8">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          {rfpTitle}
        </h1>
        <p className="text-gray-500">
          Vendor Proposals
        </p>
      </div>

      {loading && (
        <p className="text-gray-500">Loading proposals...</p>
      )}

      {!loading && proposals.length === 0 && (
        <div className="bg-white rounded-xl p-8 text-center text-gray-500 shadow-sm">
          <div className="text-4xl mb-3">📭</div>
          <p className="font-medium">
            No proposals received yet
          </p>
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
                <p className="text-sm text-gray-500">
                  {p.vendorId?.email}
                </p>
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

            {/* FOOTER */}
            <div className="mt-3 text-xs text-gray-400">
              Received on{" "}
              {new Date(p.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
    </main>
  </div>
);
};

export default RfpProposals;
