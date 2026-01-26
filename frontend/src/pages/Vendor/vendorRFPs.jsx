import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import VendorSidebar from "../../components/VendorSidebar";

function VendorRFPs() {
  const [rfps, setRfps] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRFPs = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/vendor/rfps",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setRfps(res.data);
      } catch (error) {
        console.log(error);
        localStorage.clear();
        navigate("/vendor/login");
      }
    };

    fetchRFPs();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#f8f9ff]">
      <VendorSidebar />

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">
          Received RFPs
        </h1>

        {rfps.length === 0 ? (
          <p>No RFPs received yet.</p>
        ) : (
          <div className="space-y-4">
            {rfps.map((rfp) => (
              <div
                key={rfp._id}
                className="bg-white p-6 rounded-xl shadow"
              >
                <h2 className="text-xl font-semibold">
                  {rfp.title}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Company: {rfp.createdBy.companyName}
                </p>

                <p className="mt-3 text-gray-700">
                  {rfp.description}
                </p>

                {/* ITEMS LIST */}
                {rfp.items.length > 0 && (
                  <div className="mt-4">
                    <p className="font-semibold mb-2">
                      Items Required:
                    </p>
                    <ul className="list-disc list-inside text-sm">
                      {rfp.items.map((item, idx) => (
                        <li key={idx}>
                          {item.name} — {item.quantity}
                          {item.specification &&
                            ` (${item.specification})`}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  disabled
                  className="mt-4 px-4 py-2 bg-gray-300 text-gray-700 rounded-md cursor-not-allowed"
                >
                  Reply (Next Step)
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default VendorRFPs;
