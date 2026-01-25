import { useEffect, useState } from "react";
import { User, Mail, Phone } from "lucide-react";
import { getManagerProfile,updateManagerPhone } from "../../services/managerServices";
// import {
//   getManagerProfile,
//   updateManagerPhone,
// } from "../../services/managerService";

const ManagerProfileCard = () => {
  const [manager, setManager] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchManager = async () => {
      try {
        const data = await getManagerProfile();
        console.log("Manager data from backend:", data);
        setManager(data);
      } catch (err) {
        console.error("Failed to load manager data");
      } finally {
        setLoading(false);
      }
    };

    fetchManager();
  }, []);

  const handlePhoneChange = (e) => {
    setManager({ ...manager, phone: e.target.value });
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      await updateManagerPhone(manager.phone);
      alert("Phone number updated successfully");
    } catch (err) {
      alert("Failed to update phone number");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow p-6 text-gray-500">
        Loading manager details...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md border-l-4 border-[#3F2E96] p-6 transition hover:shadow-lg">

      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <User size={18} className="text-[#3F2E96]" />
        <h2 className="text-lg font-semibold text-gray-800">
          Manager Details
        </h2>
      </div>

      {/* Name (LOCKED) */}
      <div className="mb-4">
        <label className="text-sm text-gray-600 flex items-center gap-1">
          <User size={14} /> Name
        </label>
        <input
          value={manager.name}
          disabled
          className="w-full mt-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500 cursor-not-allowed"
        />
      </div>

      {/* Email (LOCKED) */}
      <div className="mb-4">
        <label className="text-sm text-gray-600 flex items-center gap-1">
          <Mail size={14} /> Email
        </label>
        <input
          value={manager.email}
          disabled
          className="w-full mt-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500 cursor-not-allowed"
        />
      </div>

      {/* Phone (EDITABLE) */}
      <div className="mb-6">
        <label className="text-sm text-gray-700 flex items-center gap-1">
          <Phone size={14} /> Phone Number
        </label>
        <input
          value={manager.phone}
          onChange={handlePhoneChange}
          className="w-full mt-1 px-4 py-2 border border-[#3F2E96] rounded-md focus:ring-2 focus:ring-[#3F2E96]"
        />
      </div>

      {/* Action */}
      <div className="flex justify-end">
        <button
          onClick={handleUpdate}
          disabled={updating}
          className="bg-[#3F2E96] text-white px-6 py-2 rounded-md
                     hover:opacity-90 disabled:opacity-60
                     transition"
        >
          {updating ? "Updating..." : "Update Manager"}
        </button>
      </div>
    </div>
  );
};

export default ManagerProfileCard;
