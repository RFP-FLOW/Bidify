// components/Sidebar.jsx   Sidebar Component (Employee view)
import { colors } from "../../theme/colors";

export default function Sidebar() {
  return (
    <div className="h-screen w-64 p-6 text-white" style={{ background: colors.primary }}>
      <h1 className="text-xl font-bold mb-8">RFP Manager</h1>

      <ul className="space-y-4">
        <li className="font-semibold">Dashboard</li>
        <li>Create RFP</li>
        <li>Vendors</li>
      </ul>

      <div className="absolute bottom-6 text-sm opacity-80">
        Need Help? <br /> Check Documentation
      </div>
    </div>
  );
}
