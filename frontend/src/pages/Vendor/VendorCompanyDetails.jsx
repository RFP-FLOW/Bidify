import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import VendorLayout from "../../components/Vendor/Layout";

const VendorCompanyDetails = () => {
  const { id } = useParams();

  const [company, setCompany] = useState(null);
  const [requestSent, setRequestSent] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await api.get(`/company/${id}`);

        setCompany(res.data);

        // OPTIONAL:
        // agar backend alreadyRequested bhej raha ho
        if (res.data.alreadyRequested) {
          setRequestSent(true);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  const sendRequest = async () => {
    try {
      await api.post("/auth/request", {
        companyId: id,
      });

      setRequestSent(true);

      alert("Request sent to company");
    } catch (error) {
      console.log(error);
      alert("Failed to send request");
    }
  };

  if (loading) {
    return (
      <VendorLayout>
        <p className="text-gray-500">Loading...</p>
      </VendorLayout>
    );
  }

  if (!company) {
    return (
      <VendorLayout>
        <p className="text-red-500">
          Company not found
        </p>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout>
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        {/* COMPANY NAME */}
        <h2 className="text-2xl font-bold text-gray-800">
          {company.companyName}
        </h2>

        {/* DESCRIPTION */}
        <p className="mt-4 text-gray-600 leading-relaxed">
          {company.description}
        </p>

        {/* ADDRESS */}
        <p className="mt-3 text-sm text-gray-500">
          {company.address}
        </p>

        {/* BUTTON / STATUS */}
        {!requestSent ? (
          <button
            onClick={sendRequest}
            className="mt-6 px-6 py-2 bg-[#3a2d97] hover:bg-[#2f237d] text-white rounded-md transition"
          >
            Send Request
          </button>
        ) : (
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-md text-sm font-medium">
            ✔ Request Sent
          </div>
        )}
      </div>
    </VendorLayout>
  );
};

export default VendorCompanyDetails;