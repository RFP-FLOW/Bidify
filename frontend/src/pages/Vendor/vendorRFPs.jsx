import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import VendorSidebar from "../../components/Vendor/VendorSidebar";
import ReplyModal from "../../components/Vendor/ReplyModal";

function VendorRFPs() {
  const [rfps, setRfps] = useState([]);
  const [openReply, setOpenReply] = useState(false);
  const [selectedRfpId, setSelectedRfpId] = useState(null);
  const navigate = useNavigate();

  // 🔁 Fetch Open RFPs (vendor-specific)
  const fetchRFPs = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/vendor-reply/open-rfps",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRfps(res.data.data);
    } catch (error) {
      console.error(error);
      localStorage.clear();
      navigate("/vendor/login");
    }
  };

  useEffect(() => {
    fetchRFPs();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#FFF6D8]">
      <VendorSidebar />

      <main className="flex-1 px-8 py-6">
        {/* PAGE HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Open RFPs
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Requests sent by companies awaiting your proposal
          </p>
        </div>

        {/* CONTENT */}
        {rfps.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center text-gray-500">
            No RFPs available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 max-w-4xl">
            {rfps.map((rfp) => (
              <div
                key={rfp._id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200"
              >
                {/* CARD HEADER */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {rfp.title}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {rfp.companyId?.companyName || "Company"}
                    </p>
                  </div>

                  <span className="px-4 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                    OPEN
                  </span>
                </div>

                {/* CARD BODY */}
                <div className="px-5 py-4">
                  {rfp.description && (
                    <p className="text-sm text-gray-600 leading-relaxed mb-5">
                      {rfp.description}
                    </p>
                  )}

                  {rfp.items?.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-gray-800 mb-3">
                        Items Required
                      </p>

                      <div className="space-y-2">
                        {rfp.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between bg-gray-50 rounded-md px-3 py-1.5"
                          >
                            <div>
                              <p className="text-sm font-medium text-gray-700">
                                {item.name}
                              </p>
                              {item.specification && (
                                <p className="text-xs text-gray-500">
                                  {item.specification}
                                </p>
                              )}
                            </div>

                            <span className="text-sm font-semibold text-gray-700">
                              × {item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* CARD FOOTER */}
                <div className="flex justify-end px-5 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                  <button
                    disabled={rfp.hasVendorReplied}
                    onClick={() => {
                      setSelectedRfpId(rfp._id);
                      setOpenReply(true);
                    }}
                    className="px-4 py-1.5 text-sm rounded-md bg-blue-600 text-white 
                    hover:bg-blue-700 active:scale-95 transition 
                    disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {rfp.hasVendorReplied ? "Replied" : "Reply"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* REPLY MODAL */}
      <ReplyModal
        open={openReply}
        rfpId={selectedRfpId}
        onClose={() => setOpenReply(false)}
        onSuccess={fetchRFPs}   // 🔁 refresh after reply
      />
    </div>
  );
}

export default VendorRFPs;
