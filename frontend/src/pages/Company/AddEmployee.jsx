import { useState,useEffect } from "react";
import { toast } from "react-toastify";
import ManagerLayout from "../../components/Manager/SidebarCardManager";

function AddEmployee() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);

  
  /* ================= FETCH EMPLOYEES ================= */
  const fetchEmployees = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/company/manager/employees",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      setEmployees(data.employees);
    } catch {
      toast.error("Failed to load employees");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);
  


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

      if (data.type === "resent") {
            toast.success("Invitation re-sent 📩");
      } else {
            toast.success("Employee invited successfully 🎉");
     }
      setFormData({ name: "", email: "" });
      setShowForm(false);
      fetchEmployees();


    } catch (error) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };
    
     const handleResend = async (emp) => {
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
        body: JSON.stringify({
          name: emp.name,
          email: emp.email,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Failed to resend invite");
      return;
    }

    toast.success("Invitation re-sent 📩");
    fetchEmployees();

  } catch (error) {
    toast.error("Server error");
  } finally {
    setLoading(false);
  }
};


  return (
    <ManagerLayout>
     <div className="p-8">
      {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Employees</h2>

          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#3a2d97] text-white px-5 py-2 rounded-lg font-semibold"
          >
            {showForm ? "Close" : "+ Add Employee"}
          </button>
        </div>

        {/* ================= EMPLOYEE TABLE ================= */}
        <div className="bg-white rounded-xl shadow border mb-20 ">
          <table className="w-full text-sm">
            <thead className="bg-[#f4f1ff] border-b">
              <tr>
                <th className="px-5 py-4 text-center text-sm font-extrabold text-gray-800 uppercase tracking-wide">Name</th>
                <th className="px-5 py-4 text-center text-sm font-extrabold text-gray-800 uppercase tracking-wide">Email</th>
                <th className="px-5 py-4 text-center text-sm font-extrabold text-gray-800 uppercase tracking-wide">Status</th>
                <th className="px-5 py-4 text-center text-sm font-extrabold text-gray-800 uppercase tracking-wide">Action</th>
              </tr>
            </thead>

            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-500">
                    No employees added yet
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp._id} className="border-t hover:bg-gray-50 transition">
                    <td className="px-5 py-4 text-center font-semibold text-gray-800 text-[15px]">{emp.name}</td>
                    <td className="px-5 py-4 text-center font-semibold text-gray-800 text-[15px] text-blue-600">{emp.email}</td>
                    <td className="px-5 py-4 text-center font-semibold text-gray-800 text-[15px]">
                      <span
                        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide
                          ${
                            emp.status === "active"
                              ? "bg-green-100 text-green-700"
                              : emp.status === "invited"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }
                        `}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      {emp.status === "active" ? (
                        <span className="text-green-700 font-bold  gap-1 text-center"><span>Active ✔</span></span>
                      ) : (
                        <button
                          onClick={() => handleResend(emp)}
                          className="text-[#3a2d97] font-bold hover:underline underline-offset-4"
                        >
                          Resend

                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>


   { showForm && (
    <div className="bg-[#fff5d7] flex items-center justify-center px-4">
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
              onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
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
             onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
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
   )}
    </div>
    </ManagerLayout>
  );
}

export default AddEmployee;
