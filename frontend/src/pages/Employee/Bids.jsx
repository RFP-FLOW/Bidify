import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Employee/SidebarEmployee";
import { useNavigate } from "react-router-dom";

const Bids = () => {
    const navigate = useNavigate();
    const [rfps, setRfps] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const fetchBids = async () => {
        try {
            setLoading(true);

            const res = await axios.get(
                `http://localhost:5000/api/rfp/bids?page=${page}&limit=5`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            setRfps(Array.isArray(res?.data?.rfps) ? res.data.rfps : []);
            setTotalPages(res?.data?.totalPages || 1);
        } catch (error) {
            console.error("Error fetching bids:", error);
            setRfps([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBids();
    }, [page]);

    const hasAnyBid = rfps.some((rfp) => rfp.bidCount > 0);

    return (
        <div className="flex min-h-screen bg-[#f6f7fb]">
            {/* SIDEBAR */}
            <Sidebar />

            {/* MAIN */}
            <main className="flex-1 p-8">
                {/* HEADER */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Vendor Bids
                    </h1>
                    <p className="text-gray-500">
                        Track vendor responses for your sent RFPs
                    </p>
                </div>

                {/* LOADING */}
                {loading && (
                    <p className="text-gray-500">Loading bids...</p>
                )}

                {/* NO SENT RFPs */}
                {!loading && rfps.length === 0 && (
                    <div className="bg-white rounded-xl p-6 text-gray-500">
                        No sent RFPs yet. Send an RFP to vendors to start receiving bids.
                    </div>
                )}

                {/* SENT BUT NO BIDS YET */}
                {!loading && rfps.length > 0 && !hasAnyBid && (
                    <div className="bg-white rounded-xl p-6 text-gray-500 mb-6">
                        RFPs have been sent to vendors. Waiting for their responses.
                    </div>
                )}

                {/* RFP CARDS */}
                {!loading &&
  rfps.map((rfp) => (
    <div
      key={rfp._id}
      onClick={() => navigate(`/employee/rfp/${rfp._id}/proposals`)}
      className="cursor-pointer bg-white rounded-xl p-5 mb-4 flex justify-between items-center hover:bg-gray-50 hover:shadow-sm transition"
    >
      <div>
        <h3 className="font-semibold text-gray-800">
          {rfp.title}
        </h3>

        <p className="text-sm text-gray-500">
          {rfp.description || "No description"}
        </p>

        <p className="text-xs text-gray-400 mt-1">
          {new Date(rfp.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="text-right">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
          {rfp.bidCount} Bids
        </span>
      </div>
    </div>
  ))}

                {/* PAGINATION */}
                {!loading && totalPages > 1 && (
                    <div className="flex gap-4 mt-6">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                        >
                            Prev
                        </button>

                        <span className="self-center text-gray-600">
                            Page {page} of {totalPages}
                        </span>

                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage((p) => p + 1)}
                            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Bids;
