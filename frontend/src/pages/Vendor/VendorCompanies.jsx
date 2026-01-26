import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VendorLayout from "../../components/Vendor-Sidebar/Layout";
import { getAllCompanies } from "../../services/companyService";

const VendorCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await getAllCompanies();
        setCompanies(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <VendorLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">
          Available Companies
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Explore companies and send collaboration requests
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {companies.map((company) => (
          <div
            key={company._id}
            onClick={() =>
              navigate(`/vendor/companies/${company._id}`)
            }
            className="bg-white border border-gray-200 rounded-lg p-6 cursor-pointer hover:shadow"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              {company.companyName}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {company.industry}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {company.address}
            </p>
          </div>
        ))}
      </div>
    </VendorLayout>
  );
};

export default VendorCompanies;
