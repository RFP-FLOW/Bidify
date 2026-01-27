import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VendorLayout from "../../components/Vendor-Sidebar/Layout";
import { getCompanyById } from "../../services/companyService";
import { sendVendorRequest } from "../../services/vendorService";
import { LocateFixed } from "lucide-react";

const VendorCompanyDetails = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await getCompanyById(id);
        setCompany(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCompany();
  }, [id]);

  const handleSendRequest = async () => {
    try {
      setLoading(true);
      await sendVendorRequest(id);
      alert("Request sent successfully ✅");
    } catch (err) {
      console.log(err);
      alert("Request already sent or failed ❌");
    } finally {
      setLoading(false);
    }
  };

  if (!company) return <VendorLayout>Loading...</VendorLayout>;

  return (
    <VendorLayout>
      <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-3xl">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          {company.companyName}
        </h2>

        <p className="text-gray-600 mb-4">{company.description}</p>

        <p className="text-sm text-gray-500">
          <b>Industry:</b> {company.industry}
        </p>
        <p className="text-sm text-gray-500">
          <b>Address:</b> {company.address}
        </p>
        <p className="text-sm text-gray-500">
          <b>Website:</b> {company.website}
        </p>

        <div className="mt-6">
          <button
            onClick={handleSendRequest}
            disabled={loading}
            className="px-6 py-2 bg-[#3F2E96] text-white rounded-md hover:bg-[#2f2275]"
          >
            {loading ? "Sending..." : "Send Request"}
          </button>
          <button
            disabled={company.alreadyRequested}
            className={`px-6 py-2 rounded-md text-white
    ${
      company.alreadyRequested
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-[#3F2E96] hover:bg-[#2f2275]"
    }
  `}
          >
            {company.alreadyRequested ? "Request Sent" : "Send Request"}
          </button>
        </div>
      </div>
    </VendorLayout>
  );
};

export default VendorCompanyDetails;
