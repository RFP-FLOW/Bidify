import { useEffect, useMemo, useState } from "react";
import VendorLayout from "../../components/Vendor/Layout";
import api from "../../services/api";
import { toast } from "react-toastify";
import {
  User,
  Building2,
  Phone,
  MapPin,
  Globe,
  BadgeCheck,
  FileText,
} from "lucide-react";

const VendorProfile = () => {
  const [vendor, setVendor] = useState(null);

  const [editMode, setEditMode] =
    useState(false);

  

  const [formData, setFormData] =
    useState({
      name: "",
      businessName: "",
      phone: "",
      address: "",
      category: "",
      website: "",
      description: "",
    });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(
          "/vendor/profile"
        );

        setVendor(res.data.vendor);

        setFormData({
          name:
            res.data.vendor.name || "",
          businessName:
            res.data.vendor
              .businessName || "",
          phone:
            res.data.vendor.phone ||
            "",
          address:
            res.data.vendor.address ||
            "",
          category:
            res.data.vendor.category ||
            "",
          website:
            res.data.vendor.website ||
            "",
          description:
            res.data.vendor
              .description || "",
        });

        // stats removed from profile view
      } catch (err) {
        console.log(err);

        toast.error(
          "Failed to load profile"
        );
      }
    };

    fetchProfile();
  }, []);

  const profileCompletion = useMemo(() => {
    const fields = [
      formData.name,
      formData.businessName,
      formData.phone,
      formData.address,
      formData.category,
      formData.website,
      formData.description,
      vendor?.gstNumber,
    ];

    const completed = fields.filter(
      (field) =>
        field &&
        field.trim() !== ""
    ).length;

    return Math.round(
      (completed / fields.length) * 100
    );
  }, [formData, vendor]);

  const handleUpdate = async () => {
    try {
      const res = await api.put(
        "/vendor/profile",
        formData
      );

      toast.success(
        "Profile updated successfully"
      );

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
        <p className="t-secondary">
          Loading profile...
        </p>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout>
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8 animate-fadeIn">
        <div className="flex items-center gap-5">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center text-3xl font-bold"
            style={{
              background:
                "var(--accent-subtle)",
              color:
                "var(--accent-text)",
            }}
          >
            {vendor.businessName?.charAt(
              0
            )}
          </div>

          <div>
            <h1 className="t-primary text-3xl font-bold tracking-[-0.02em]">
              {vendor.businessName}
            </h1>

            <p className="t-muted mt-1">
              {vendor.email}
            </p>

            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
              <BadgeCheck size={15} />
              Verified Vendor
            </div>
          </div>
        </div>

        {/* PROFILE COMPLETION */}
        <div className="card p-5 w-full lg:w-[320px]">
          <div className="flex justify-between items-center mb-3">
            <p className="t-secondary text-sm font-medium">
              Profile Completion
            </p>

            <p className="font-bold text-[var(--accent)]">
              {profileCompletion}%
            </p>
          </div>

          <div className="w-full h-3 rounded-full overflow-hidden bg-input">
            <div
              className="h-3 rounded-full transition-all duration-500"
              style={{
                width: `${profileCompletion}%`,
                background:
                  "var(--accent)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Stats removed from profile view */}

      {/* PROFILE DETAILS */}
      <div className="card p-7 space-y-8 animate-fadeIn">
        {/* OWNER NAME */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <User
              size={16}
              className="t-secondary"
            />

            <p className="t-muted text-sm">
              Owner Name
            </p>
          </div>

          {editMode ? (
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              className="input-themed w-full"
            />
          ) : (
            <p className="t-primary text-lg font-medium">
              {vendor.name}
            </p>
          )}
        </div>

        {/* BUSINESS NAME */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Building2
              size={16}
              className="t-secondary"
            />

            <p className="t-muted text-sm">
              Business Name
            </p>
          </div>

          {editMode ? (
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  businessName:
                    e.target.value,
                })
              }
              className="input-themed w-full"
            />
          ) : (
            <p className="t-primary text-lg font-medium">
              {vendor.businessName}
            </p>
          )}
        </div>

        {/* PHONE */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Phone
              size={16}
              className="t-secondary"
            />

            <p className="t-muted text-sm">
              Phone Number
            </p>
          </div>

          {editMode ? (
            <input
              type="text"
              value={formData.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phone: e.target.value,
                })
              }
              className="input-themed w-full"
            />
          ) : (
            <p className="t-primary text-lg font-medium">
              {vendor.phone ||
                "Not Provided"}
            </p>
          )}
        </div>

        {/* ADDRESS */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MapPin
              size={16}
              className="t-secondary"
            />

            <p className="t-muted text-sm">
              Office Address
            </p>
          </div>

          {editMode ? (
            <textarea
              value={formData.address}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address:
                    e.target.value,
                })
              }
              rows={3}
              className="input-themed w-full"
            />
          ) : (
            <p className="t-primary text-lg font-medium">
              {vendor.address ||
                "Not Provided"}
            </p>
          )}
        </div>

        {/* CATEGORY */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileText
              size={16}
              className="t-secondary"
            />

            <p className="t-muted text-sm">
              Vendor Category
            </p>
          </div>

          {editMode ? (
            <input
              type="text"
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category:
                    e.target.value,
                })
              }
              className="input-themed w-full"
            />
          ) : (
            <p className="t-primary text-lg font-medium">
              {vendor.category ||
                "Not Provided"}
            </p>
          )}
        </div>

        {/* WEBSITE */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Globe
              size={16}
              className="t-secondary"
            />

            <p className="t-muted text-sm">
              Website
            </p>
          </div>

          {editMode ? (
            <input
              type="text"
              value={formData.website}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  website:
                    e.target.value,
                })
              }
              className="input-themed w-full"
            />
          ) : (
            <p className="text-blue-500 text-lg font-medium">
              {vendor.website ||
                "Not Provided"}
            </p>
          )}
        </div>

        {/* DESCRIPTION */}
        <div>
          <p className="t-muted text-sm mb-2">
            Business Description
          </p>

          {editMode ? (
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description:
                    e.target.value,
                })
              }
              rows={5}
              className="input-themed w-full"
            />
          ) : (
            <div className="bg-input b-subtle rounded-2xl p-5">
              <p className="t-secondary leading-relaxed">
                {vendor.description ||
                  "No business description added yet."}
              </p>
            </div>
          )}
        </div>

        {/* EMAIL */}
        <div>
          <p className="t-muted text-sm mb-2">
            Email
          </p>

          <p className="t-primary text-lg font-medium">
            {vendor.email}
          </p>
        </div>

        {/* GST */}
        <div>
          <p className="t-muted text-sm mb-2">
            GST Number
          </p>

          <p className="t-primary text-lg font-medium">
            {vendor.gstNumber}
          </p>
        </div>

        {/* BUTTONS */}
        <div
          className="pt-6 flex gap-4"
          style={{
            borderTop:
              "1px solid var(--border-color)",
          }}
        >
          {editMode ? (
            <>
              <button
                onClick={handleUpdate}
                className="btn-primary"
              >
                Save Changes
              </button>

              <button
                onClick={() =>
                  setEditMode(false)
                }
                className="px-5 py-2.5 rounded-xl font-medium transition-all duration-200 bg-input t-primary hover:opacity-90"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() =>
                setEditMode(true)
              }
              className="btn-primary"
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