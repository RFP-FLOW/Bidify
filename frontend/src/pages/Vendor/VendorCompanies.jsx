import VendorLayout from "../../components/Vendor-Sidebar/VendorLayout";

const VendorCompanies = () => {
  return (
    <VendorLayout>
      <h2 className="text-2xl font-semibold mb-6">
        Available Companies
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* reuse CompanyProfileCard style */}
        <CompanyProfileCard />
      </div>
    </VendorLayout>
  );
};

export default VendorCompanies;
