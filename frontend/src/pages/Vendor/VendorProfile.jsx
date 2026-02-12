import { useEffect, useState } from "react";
import VendorLayout from "../../components/Vendor/Layout";
import api from "../../services/api";
import { toast } from "react-toastify";

const VendorProfile = () => {
  const [vendor, setVendor] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/vendor/profile");
        setVendor(res.data.vendor);
        setFormData({
          name: res.data.vendor.name,
          businessName: res.data.vendor.businessName,
        });
      } catch (err) {
        console.log(err);
        toast.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      const res = await api.put("/vendor/profile", formData);
      toast.success("Profile updated successfully");
      setVendor(res.data.vendor);
      setEditMode(false);
    } catch (err) {
      console.log(err);

      toast.error("Update failed");
    }
  };

  if (!vendor) {
    return (
      <VendorLayout>
        <p className="text-gray-500">Loading profile...</p>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout>
      <h2 className="text-2xl font-semibold mb-6">Vendor Profile</h2>

      <div className="bg-white border rounded-xl p-6 space-y-6">
        {/* Owner Name */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Owner Name</p>
            {editMode ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1 border rounded-lg px-3 py-1"
              />
            ) : (
              <p className="text-lg font-medium">{vendor.name}</p>
            )}
          </div>
        </div>

        {/* Business Name */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Business Name</p>
            {editMode ? (
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    businessName: e.target.value,
                  })
                }
                className="mt-1 border rounded-lg px-3 py-1"
              />
            ) : (
              <p className="text-lg font-medium">{vendor.businessName}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="text-lg font-medium">{vendor.email}</p>
        </div>

        {/* GST */}
        <div>
          <p className="text-sm text-gray-500">GST Number</p>
          <p className="text-lg font-medium">{vendor.gstNumber}</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4 border-t">
          {editMode ? (
            <>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
              >
                Save
              </button>

              <button
                onClick={() => setEditMode(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg text-sm"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </VendorLayout>
  );
};

export default VendorProfile;
