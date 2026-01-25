import ManagerSidebar from "./SidebarManager";

function ManagerLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#fff5d7] flex">
      <ManagerSidebar />

      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}

export default ManagerLayout;
