import { useEffect, useState } from "react";
import VendorLayout from "../../components/Vendor/Layout";
import api from "../../services/api";
import {
  FileText,
  IndianRupee,
  Clock3,
} from "lucide-react";

const MyProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const res = await api.get(
          "/vendor-reply/my-proposals"
        );

        setProposals(res.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);

  if (loading) {
    return (
      <VendorLayout>
        <p className="t-secondary">
          Loading proposals...
        </p>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout>
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8 animate-fadeIn">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{
            background: "var(--accent-subtle)",
            color: "var(--accent-text)",
          }}
        >
          <FileText size={26} />
        </div>

        <div>
          <h1 className="t-primary text-2xl font-bold tracking-[-0.02em]">
            My Proposals
          </h1>

          <p className="t-muted text-sm mt-0.5">
            Track all submitted vendor proposals.
          </p>
        </div>
      </div>

      {/* EMPTY */}
      {proposals.length === 0 ? (
        <div className="card p-10 text-center animate-fadeIn">
          <div
            className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4"
            style={{
              background: "var(--accent-subtle)",
              color: "var(--accent-text)",
            }}
          >
            <FileText size={24} />
          </div>

          <h3 className="t-primary text-lg font-semibold">
            No proposals submitted
          </h3>

          <p className="t-muted text-sm mt-2">
            Your submitted proposals will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {proposals.map((proposal) => (
            <div
              key={proposal._id}
              className="card p-6 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg animate-fadeIn"
            >
              {/* TOP */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="t-primary text-lg font-semibold">
                    {proposal.rfpId?.title}
                  </h2>

                  <p className="t-muted text-sm mt-1">
                    {
                      proposal.companyId
                        ?.companyName
                    }
                  </p>
                </div>

                <span
                  className={`px-4 py-2 rounded-full text-xs font-bold
                  ${
                    proposal.status ===
                    "ACCEPTED"
                      ? "bg-green-100 text-green-700"
                      : proposal.status ===
                        "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {proposal.status}
                </span>
              </div>

              {/* DIVIDER */}
              <div
                className="my-5"
                style={{
                  borderTop:
                    "1px solid var(--border-color)",
                }}
              />

              {/* DETAILS */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                <div>
                  <p className="t-muted text-xs mb-1">
                    Quoted Price
                  </p>

                  <div className="flex items-center gap-1">
                    <IndianRupee
                      size={16}
                      className="text-green-500"
                    />

                    <p className="text-xl font-bold text-green-500">
                      {proposal.quotedPrice}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="t-muted text-xs mb-1">
                    Delivery Time
                  </p>

                  <div className="flex items-center gap-2">
                    <Clock3
                      size={15}
                      className="t-secondary"
                    />

                    <p className="t-primary font-medium">
                      {
                        proposal.deliveryDays
                      }{" "}
                      days
                    </p>
                  </div>
                </div>

                <div>
                  <p className="t-muted text-xs mb-1">
                    Submitted On
                  </p>

                  <p className="t-primary font-medium">
                    {new Date(
                      proposal.createdAt
                    ).toLocaleDateString(
                      "en-IN"
                    )}
                  </p>
                </div>
              </div>

              {/* MESSAGE */}
              {proposal.message && (
                <div className="mt-5">
                  <p className="t-muted text-xs mb-2">
                    Proposal Message
                  </p>

                  <div className="bg-input b-subtle rounded-xl p-4">
                    <p className="t-secondary text-sm leading-relaxed">
                      {proposal.message}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </VendorLayout>
  );
};

export default MyProposals;