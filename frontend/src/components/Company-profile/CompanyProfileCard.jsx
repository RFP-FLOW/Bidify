import { useState,useEffect } from "react";
import { updateCompanyProfile,getCompanyProfile } from "../../services/companyService";
import { toast } from "react-toastify";

const CompanyProfileCard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);


  const [company, setCompany] = useState({
    name: "",
    gstNumber: "",
    address:"",
    website: "",
    description: "",
    phone:"",
  });
   

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const data = await getCompanyProfile();
        setCompany({
              companyName: data.companyName,
              gstNumber: data.gstNumber || "",
              website: data.website || "",
              phone: data.phone || "",
              address: data.address || "",
              description: data.description || "",
            });
      } catch {
        toast.error("Failed to load company profile");
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, []);

  const handleChange = (e) => {
     const { name, value } = e.target;

  // 🔥 GST should always be uppercase
     if (name === "gstNumber") {
       setCompany({ ...company, gstNumber: value.toUpperCase() });
     return;
    }
    setCompany({ ...company, [e.target.name]: e.target.value });
  };
   
  // ✅ PHONE VALIDATION
    const isValidPhone = (phone) => {
       if (!phone) return true; // optional field

      const phoneRegex = /^[6-9]\d{9}$/;
      return phoneRegex.test(phone);
    };

    const websiteRegex =  /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;


  const handleSave = async () => {
     if (!isValidPhone(company.phone)) {
    toast.error("Please enter a valid phone number");
    return;
  }

   if (company.website && !websiteRegex.test(company.website)) {
    toast.error(
      "Enter a valid website (e.g. mnnit.ac.in, https://example.com)"
    );
    return;
  }

   if (company.gstNumber && !gstRegex.test(company.gstNumber)) {
    toast.error(
      "Invalid GST number (e.g. 09BBKPS4521M1ZQ)"
    );
    return;
  }

    try{
    await updateCompanyProfile({
      address: company.address,
      description: company.description,
      gstNumber: company.gstNumber,
       website: company.website,
      phone:company.phone,
    });
    toast.success("Company profile updated");
    setIsEditing(false);
    } catch {
    toast.error("Update failed");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
      <div className="flex justify-between items-center mb-4">
       <div>
          <h2 className="text-2xl font-bold text-gray-800">Company Details</h2>
          <p className="text-sm text-gray-500">
            Manage your company information
          </p>
      </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-5 py-2 bg-[#3F2E96] text-white font-semibold rounded-lg
                       shadow-md hover:shadow-lg transition"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Company Name (LOCKED) */}
      <div className="mb-4">
        <label className="text-sm font-semibold text-gray-600">Company Name</label>
        <input
          value={company.companyName}
          disabled
          className="w-full mt-2 px-4 py-2 rounded-lg bg-gray-100
                     text-gray-600 font-semibold border border-gray-200
                     cursor-not-allowed"
        />
      </div>

      {/* GST */}
      <div className="mb-4">
        <label className="text-sm font-semibold text-gray-600">GST Number</label>
        <input
          name="gstNumber"
          value={company.gstNumber||""}
          disabled={!isEditing}
          onChange={handleChange}
          className={`w-full mt-2 px-4 py-2 rounded-lg border
              ${isEditing
                ? "bg-white border-gray-300 focus:ring-2 focus:ring-[#3F2E96]/30"
                : "bg-gray-100 border-gray-200"}
            `}
        />
      </div>

      {/* Website */}
      <div className="mb-4">
        <label className="text-sm font-semibold text-gray-600">Website</label>
        <input
          name="website"
          value={company.website||""}
          disabled={!isEditing}
          onChange={handleChange}
          className={`w-full mt-2 px-4 py-2 rounded-lg border
              ${isEditing
                ? "bg-white border-gray-300 focus:ring-2 focus:ring-[#3F2E96]/30"
                : "bg-gray-100 border-gray-200"}
            `}
        />
      </div>

     {/*Phone*/}
      <div className="mb-4">
        <label className="text-sm font-semibold text-gray-600">Phone No.</label>
        <input
          name="phone"
          value={company.phone||""}
          disabled={!isEditing}
          onChange={handleChange}
           inputMode="numeric"
            maxLength={10}
          className={`w-full mt-2 px-4 py-2 rounded-lg border
              ${isEditing
                ? "bg-white border-gray-300 focus:ring-2 focus:ring-[#3F2E96]/30"
                : "bg-gray-100 border-gray-200"}
            `}
        />
      </div>

      {/* Address */}
      <div className="mb-4">
        <label className="text-sm font-semibold text-gray-600">Address</label>
        <textarea
          name="address"
          value={company.address||""}
          disabled={!isEditing}
          onChange={handleChange}
          className={`w-full mt-2 px-4 py-2 rounded-lg border
              ${isEditing
                ? "bg-white border-gray-300 focus:ring-2 focus:ring-[#3F2E96]/30"
                : "bg-gray-100 border-gray-200"}
            `}
        />
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-semibold text-gray-600">Description</label>
        <textarea
          name="description"
          value={company.description||""}
          disabled={!isEditing}
          onChange={handleChange}
          className={`w-full mt-2 px-4 py-2 rounded-lg border
              ${isEditing
                ? "bg-white border-gray-300 focus:ring-2 focus:ring-[#3F2E96]/30"
                : "bg-gray-100 border-gray-200"}
            `}
        />
      </div>

      {/* Buttons */}
      {isEditing && (
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={() => setIsEditing(false)}
           className="px-5 py-2 border border-gray-300 rounded-lg font-semibold"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-2 bg-[#3F2E96] text-white rounded-lg
                       font-semibold shadow-md hover:shadow-lg transition"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default CompanyProfileCard;