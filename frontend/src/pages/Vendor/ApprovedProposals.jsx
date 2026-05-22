import { useEffect, useState } from "react";
import axios from "axios";
import VendorLayout from "../../components/Vendor/Layout";
import {
  CheckCircle2,
  IndianRupee,
  Clock3,
  FileText,
} from "lucide-react";

const ApprovedProposals = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(
        "http://localhost:5000/api/vendor/approved",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },
        }
      )
      .then((res) =>
        setData(res.data.proposals)
      )
      .catch((err) =>
        console.error(err)
      );
  }, []);

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
          <CheckCircle2 size={26} />
        </div>

        <div>
          <h1 className="t-primary text-2xl font-bold tracking-[-0.02em]">
            Approved Proposals
          </h1>

          <p className="t-muted text-sm mt-0.5">
            Proposals approved by companies
          </p>
        </div>
      </div>

      {/* EMPTY */}
      {data.length === 0 && (
        <div className="card p-10 text-center animate-fadeIn">
          <div
            className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4"
            style={{
              background: "var(--accent-subtle)",
              color: "var(--accent-text)",
            }}
          >
            <CheckCircle2 size={24} />
          </div>

          <p className="t-muted text-sm">
            No approved proposals yet
          </p>
        </div>
      )}

      {/* LIST */}
      <div className="space-y-6">
        {data.map((p, i) => (
          <div
            key={i}
            className="card p-6 border-l-4 border-green-500 hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] animate-fadeIn"
          >
            {/* TOP */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="t-primary text-lg font-semibold">
                  {p.rfpTitle}
                </h2>

                <p className="t-muted text-xs mt-1">
                  Approved by Company
                </p>

                <p className="t-primary text-sm font-semibold mt-3">
                  {p.companyName}
                </p>

                <p className="t-secondary text-sm mt-1">
                  {p.companyEmail}
                </p>

                <p className="t-secondary text-sm mt-1">
                  GST: {p.companyGst}
                </p>
              </div>

              <span className="px-4 py-2 rounded-full text-xs font-bold bg-green-100 text-green-700">
                ACCEPTED
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <p className="t-muted text-xs mb-1">
                  Total Cost
                </p>

                <div className="flex items-center gap-1">
                  <IndianRupee
                    size={16}
                    className="text-green-500"
                  />

                  <p className="text-xl font-bold text-green-500">
                    {Number(
                      p.price || 0
                    ).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              <div>
                <p className="t-muted text-xs mb-1">
                  Delivery
                </p>

                <div className="flex items-center gap-2">
                  <Clock3
                    size={15}
                    className="t-secondary"
                  />

                  <p className="t-primary font-medium">
                    {p.deliveryDays} days
                  </p>
                </div>
              </div>

              <div>
                <p className="t-muted text-xs mb-1">
                  Approved On
                </p>

                <p className="t-primary font-medium">
                  {new Date(
                    p.approvedAt
                  ).toLocaleDateString(
                    "en-IN"
                  )}
                </p>
              </div>
            </div>

            {/* FILE */}
            {p.attachment && (
              <div className="mt-6 flex justify-between items-center">
                <p className="t-muted text-xs">
                  Attached Proposal
                </p>

                <a
                  href={p.attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary !py-2 !px-4 !text-xs"
                >
                  <FileText size={14} />
                  View File
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </VendorLayout>
  );
};

export default ApprovedProposals;