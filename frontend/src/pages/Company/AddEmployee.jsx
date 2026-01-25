import { useState } from "react";
import { toast } from "react-toastify";
import ManagerLayout from "../../components/Manager-Sidebar/SidebarCardManager";

function AddEmployee() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!formData.name || !formData.email) {
      toast.error("Please fill all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Enter a valid email");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/company/manager/add-employee",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to add employee");
        return;
      }

      toast.success("Invitation sent to employee 📩");
      setFormData({ name: "", email: "" });

    } catch (error) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ManagerLayout>
    <div className="min-h-screen bg-[#fff5d7] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        <h2 className="text-2xl font-bold text-center mb-6">
          Add Employee
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* EMPLOYEE NAME */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3a2d97]/40 outline-none"
              placeholder="Enter employee name"
            />
          </div>

          {/* EMPLOYEE EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3a2d97]/40 outline-none"
              placeholder="employee@company.com"
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold transition-all
              ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#3a2d97] text-white hover:shadow-lg"}
            `}
          >
            {loading ? "Sending Invite..." : "Send Password Setup Link"}
          </button>

        </form>
      </div>
    </div>
    </ManagerLayout>
  );
}

export default AddEmployee;
