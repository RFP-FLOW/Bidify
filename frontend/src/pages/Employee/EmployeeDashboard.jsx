// pages/Employee/EmployeeDashboard.jsx
import Sidebar from "../../components/Sidebar";
import StatCard from "../../components/StatCard";
import RFPCard from "../../components/RFPCard";
import { colors } from "../../theme/colors";

export default function EmployeeDashboard() {
  return (
    <div className="flex bg-[#F5F7FF] min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">RFP Dashboard</h1>
            <p className="text-gray-500">Manage your procurement requests efficiently</p>
          </div>
          <button className="px-4 py-2 rounded-lg text-white" style={{ background: colors.primary }}>
            Create New RFP
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard title="Draft RFPs" count="1" bg="#FFF7ED" icon="⏳" />
          <StatCard title="Sent RFPs" count="2" bg="#EEF2FF" icon="📨" />
          <StatCard title="Closed RFPs" count="0" bg="#ECFDF5" icon="✅" />
        </div>

        <h2 className="font-semibold mb-4">All RFPs</h2>

        <RFPCard
          title="Laptop Mouse Procurement"
          desc="I need 20 mouse for my laptop"
          status="DRAFT"
          date="Dec 7, 2025"
        />

        <RFPCard
          title="Procurement of Laptops and Headphones"
          desc="20 laptops, 10 ANC headphones, 16GB RAM"
          status="SENT"
          date="Dec 7, 2025"
        />
      </div>
    </div>
  );
}
