import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import VendorLayout from "../../components/Vendor-Sidebar/Layout";

const VendorCompanyDetails = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);

  useEffect(() => {
    const fetchCompany = async () => {
      const res = await api.get(`/company/${id}`);
      setCompany(res.data);
    };
    fetchCompany();
  }, [id]);

  const sendRequest = async () => {
    await api.post("/vendor/request", {
      companyId: id,
    });
    alert("Request sent to company");
  };

  if (!company) return <p>Loading...</p>;

  return (
    <VendorLayout>
      <h2 className="text-2xl font-bold">
        {company.companyName}
      </h2>

      <p className="mt-4 text-gray-600">
        {company.description}
      </p>

      <p className="mt-2 text-sm text-gray-500">
        {company.address}
      </p>

      <button
        onClick={sendRequest}
        className="mt-6 px-6 py-2 bg-[#3a2d97] text-white rounded-md"
      >
        Send Request
      </button>
    </VendorLayout>
  );
};

export default VendorCompanyDetails;
