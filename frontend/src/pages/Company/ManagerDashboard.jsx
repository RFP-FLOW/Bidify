import ManagerLayout  from "../../components/Manager-Sidebar/SidebarCardManager";
function ManagerDashboard() {

  return (
    <ManagerLayout>
    <div className="min-h-screen bg-[#fff5d7] flex">

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            Welcome, Manager <span>👋</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Here’s what’s happening in your company today
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StatCard title="Active RFPs" value="6" />
          <StatCard title="Confirmed RFPs" value="2" />
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-5 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">
              Recent Vendor Requests
            </h3>
          </div>

          <table className="w-full text-sm">
            <tbody>
              {[
                "Vendor A – Laptop Supplier",
                "Vendor B – Sensor Supplier",
              ].map((vendor) => (
                <tr
                  key={vendor}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-5 py-4">{vendor}</td>
                  <td className="px-5 py-4 text-right">
                    <button className="px-4 py-1.5 rounded-md bg-[#3a2d97] text-white text-sm">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
    </ManagerLayout>
  );
}


function StatCard({ title, value }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-semibold text-gray-900 mt-1">
        {value}
      </p>
    </div>
  );
}

export default ManagerDashboard;
