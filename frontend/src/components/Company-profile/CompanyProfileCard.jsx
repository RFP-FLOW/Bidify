import { useState } from "react";

const CompanyProfileCard = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [company, setCompany] = useState({
    name: "Bidify Pvt Ltd",
    gst: "27ABCDE1234F1Z5",
    address: "Bangalore, India",
    website: "https://bidify.com",
    description: "We provide RFP and bidding solutions."
  });

  const handleChange = (e) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Company Details
        </h2>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-[#3F2E96] font-medium"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Company Name (LOCKED) */}
      <div className="mb-4">
        <label className="text-sm text-gray-600">Company Name</label>
        <input
          value={company.name}
          disabled
          className="w-full mt-1 px-4 py-2 bg-gray-100 border rounded-md text-gray-500"
        />
      </div>

      {/* GST */}
      <div className="mb-4">
        <label className="text-sm text-gray-600">GST Number</label>
        <input
          name="gst"
          value={company.gst}
          disabled={!isEditing}
          onChange={handleChange}
          className={`w-full mt-1 px-4 py-2 border rounded-md ${
            isEditing ? "bg-white" : "bg-gray-100"
          }`}
        />
      </div>

      {/* Website */}
      <div className="mb-4">
        <label className="text-sm text-gray-600">Website</label>
        <input
          name="website"
          value={company.website}
          disabled={!isEditing}
          onChange={handleChange}
          className={`w-full mt-1 px-4 py-2 border rounded-md ${
            isEditing ? "bg-white" : "bg-gray-100"
          }`}
        />
      </div>

      {/* Address */}
      <div className="mb-4">
        <label className="text-sm text-gray-600">Address</label>
        <textarea
          name="address"
          value={company.address}
          disabled={!isEditing}
          onChange={handleChange}
          className={`w-full mt-1 px-4 py-2 border rounded-md ${
            isEditing ? "bg-white" : "bg-gray-100"
          }`}
        />
      </div>

      {/* Description */}
      <div>
        <label className="text-sm text-gray-600">Description</label>
        <textarea
          name="description"
          value={company.description}
          disabled={!isEditing}
          onChange={handleChange}
          className={`w-full mt-1 px-4 py-2 border rounded-md ${
            isEditing ? "bg-white" : "bg-gray-100"
          }`}
        />
      </div>

      {/* Buttons */}
      {isEditing && (
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 border rounded-md"
          >
            Cancel
          </button>

          <button
            onClick={() => setIsEditing(false)}
            className="px-6 py-2 bg-[#3F2E96] text-white rounded-md"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default CompanyProfileCard;
