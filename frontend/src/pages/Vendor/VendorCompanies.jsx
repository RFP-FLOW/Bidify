import { useEffect, useState } from "react";
import { getAllCompanies } from "../../services/companyService";
import { useNavigate } from "react-router-dom";
import VendorLayout from "../../components/Vendor-Sidebar/Layout";

const VendorCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await getAllCompanies();
        setCompanies(res.data.companies);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <VendorLayout>
      <h2 className="text-2xl font-semibold mb-6">
        Available Companies
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {companies.map((company) => (
          <div
            key={company._id}
            className="bg-white border rounded-lg p-5 cursor-pointer hover:shadow"
            onClick={() =>
              navigate(`/vendor/companies/${company._id}`)
            }
          >
            <h3 className="text-lg font-bold">
              {company.companyName}
            </h3>

            <p className="text-sm text-gray-600 mt-2">
              {company.description || "No description available"}
            </p>

            <p className="text-xs text-gray-400 mt-3">
              {company.address}
            </p>
          </div>
        ))}
      </div>
    </VendorLayout>
  );
};

export default VendorCompanies;
