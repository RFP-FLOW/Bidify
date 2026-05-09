import VendorSidebar from "./VendorSidebar";

const VendorLayout = ({ children }) => (
  <div className="page-layout">
    <VendorSidebar />
    <main className="page-content max-w-6xl mx-auto">{children}</main>
  </div>
);

export default VendorLayout;
