import SidebarManager from "./SidebarManager";

export default function ManagerLayout({ children }) {
  return (
    <div className="page-layout">
      <SidebarManager />
      <main className="page-content max-w-6xl mx-auto">{children}</main>
    </div>
  );
}
