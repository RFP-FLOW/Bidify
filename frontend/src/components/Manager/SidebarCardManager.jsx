import Navbar from "../Navbar";
import ManagerSidebar from "./SidebarManager";

function ManagerLayout({ children }) {
  const user=JSON.parse(localStorage.getItem("user"));
  const companyName=user?.companyName || "Company";
  return (
    <div className="bg-[#fff5d7] ">
      <Navbar/>
      <ManagerSidebar companyName={companyName} />

      <main className="ml-64 min-h-[calc(100vh-4rem)] overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}

export default ManagerLayout;
