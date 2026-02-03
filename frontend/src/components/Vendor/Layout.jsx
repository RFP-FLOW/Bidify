import VendorSidebar from "./VendorSidebar";

const VendorLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#fff5d7] flex">
      <VendorSidebar />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
};

export default VendorLayout;
