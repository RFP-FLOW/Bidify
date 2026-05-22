import {
  useEffect,
  useMemo,
  useState,
} from "react";

import VendorLayout from "../../components/Vendor/Layout";
import API from "../../utils/axiosInstance";

import {
  Search,
  Send,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

const VendorRequests = () => {
  const [requests, setRequests] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("ALL");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await API.get(
          "/vendor/requests"
        );

        setRequests(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchesSearch =
        req.companyId?.companyName
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesFilter =
        filter === "ALL"
          ? true
          : req.status === filter;

      return (
        matchesSearch &&
        matchesFilter
      );
    });
  }, [requests, search, filter]);

  const stats = {
    total: requests.length,

    approved: requests.filter(
      (r) =>
        r.status === "APPROVED"
    ).length,

    pending: requests.filter(
      (r) =>
        r.status === "PENDING"
    ).length,

    rejected: requests.filter(
      (r) =>
        r.status === "REJECTED"
    ).length,
  };

  if (loading) {
    return (
      <VendorLayout>
        <p className="t-secondary">
          Loading requests...
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
            background:
              "var(--accent-subtle)",
            color:
              "var(--accent-text)",
          }}
        >
          <Send size={26} />
        </div>

        <div>
          <h1 className="t-primary text-2xl font-bold tracking-[-0.02em]">
            My Requests
          </h1>

          <p className="t-muted text-sm mt-0.5">
            Track all company
            connection requests.
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          {
            label: "Total Requests",
            value: stats.total,
            color:
              "bg-blue-100 text-blue-700",
            icon: Send,
          },

          {
            label: "Approved",
            value: stats.approved,
            color:
              "bg-green-100 text-green-700",
            icon: CheckCircle2,
          },

          {
            label: "Pending",
            value: stats.pending,
            color:
              "bg-yellow-100 text-yellow-700",
            icon: Clock3,
          },

          {
            label: "Rejected",
            value: stats.rejected,
            color:
              "bg-red-100 text-red-700",
            icon: XCircle,
          },
        ].map(
          ({
            label,
            value,
            color,
            icon: Icon,
          }) => (
            <div
              key={label}
              className="card p-5 hover:translate-y-[-2px] transition-all duration-300"
            >
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${color}`}
              >
                <Icon size={14} />

                {label}
              </div>

              <h3 className="t-primary text-3xl font-bold mt-4">
                {value}
              </h3>
            </div>
          )
        )}
      </div>

      {/* FILTER + SEARCH */}
      <div className="card p-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fadeIn">
        {/* FILTERS */}
        <div className="flex gap-2 flex-wrap">
          {[
            "ALL",
            "PENDING",
            "APPROVED",
            "REJECTED",
          ].map((item) => (
            <button
              key={item}
              onClick={() =>
                setFilter(item)
              }
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
              ${
                filter === item
                  ? "text-white"
                  : "bg-input t-secondary hover:opacity-90"
              }`}
              style={
                filter === item
                  ? {
                      background:
                        "var(--accent)",
                    }
                  : {}
              }
            >
              {item}
            </button>
          ))}
        </div>

        {/* SEARCH */}
        <div className="relative w-full md:w-[280px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 t-secondary"
          />

          <input
            type="text"
            placeholder="Search company..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="input-themed w-full pl-10"
          />
        </div>
      </div>

      {/* EMPTY */}
      {filteredRequests.length ===
      0 ? (
        <div className="card p-10 text-center animate-fadeIn">
          <div
            className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4"
            style={{
              background:
                "var(--accent-subtle)",
              color:
                "var(--accent-text)",
            }}
          >
            <Send size={24} />
          </div>

          <h3 className="t-primary text-lg font-semibold">
            No Requests Found
          </h3>

          <p className="t-muted text-sm mt-2">
            Try changing filters
            or search keywords.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map(
            (req) => (
              <div
                key={req._id}
                className="card p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-lg hover:translate-y-[-2px] transition-all duration-300 animate-fadeIn"
              >
                {/* LEFT */}
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold"
                    style={{
                      background:
                        "var(--accent-subtle)",
                      color:
                        "var(--accent-text)",
                    }}
                  >
                    {req.companyId?.companyName?.charAt(
                      0
                    )}
                  </div>

                  <div>
                    <h4 className="t-primary text-lg font-semibold">
                      {
                        req
                          .companyId
                          ?.companyName
                      }
                    </h4>

                    <p className="t-muted text-sm mt-1">
                      Request ID:{" "}
                      {req._id}
                    </p>

                    <p className="t-muted text-xs mt-1">
                      Sent on{" "}
                      {new Date(
                        req.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* STATUS */}
                <div>
                  <span
                    className={`px-4 py-2 rounded-full text-xs font-bold
                    ${
                      req.status ===
                      "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : req.status ===
                          "APPROVED"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </VendorLayout>
  );
};

export default VendorRequests;