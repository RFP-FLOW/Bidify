import Navbar from "../Navbar";
import ManagerSidebar from "./SidebarManager";

function ManagerLayout({ children }) {
  const user=JSON.parse(localStorage.getItem("user"));
  const companyName=user?.companyName || "Company";
  return (
    <div className="bg-[#fff5d7] min-h-screen ">
     <Navbar/>
     <div className="flex">
      <ManagerSidebar companyName={companyName} />
      <main className="flex-1 px-8 py-8">
      <div className="max-w-6xl mx-auto">
        {children}
      </div>
      </main>
    </div>
    </div>
  );
}

export default ManagerLayout;
