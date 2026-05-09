import { useState, useEffect } from "react";
import { updateCompanyProfile, getCompanyProfile } from "../../services/companyService";
import { toast } from "react-toastify";
import { Pencil, Save, X, Loader2 } from "lucide-react";

const CompanyProfileCard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [company, setCompany] = useState({ companyName: "", gstNumber: "", address: "", website: "", description: "", phone: "" });

  useEffect(() => {
    (async () => {
      try {
        const data = await getCompanyProfile();
        setCompany({ companyName: data.companyName, gstNumber: data.gstNumber || "", website: data.website || "", phone: data.phone || "", address: data.address || "", description: data.description || "" });
      } catch { toast.error("Failed to load company profile"); }
      finally { setLoading(false); }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompany(prev => ({ ...prev, [name]: name === "gstNumber" ? value.toUpperCase() : value }));
  };

  const handleSave = async () => {
    if (company.phone && !/^[6-9]\d{9}$/.test(company.phone)) return toast.error("Please enter a valid phone number");
    if (company.website && !/^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(company.website)) return toast.error("Enter a valid website");
    if (company.gstNumber && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(company.gstNumber)) return toast.error("Invalid GST number");
    try {
      setSaving(true);
      await updateCompanyProfile({ address: company.address, description: company.description, gstNumber: company.gstNumber, website: company.website, phone: company.phone });
      toast.success("Company profile updated"); setIsEditing(false);
    } catch { toast.error("Update failed"); }
    finally { setSaving(false); }
  };

  const fields = [
    { label: "Company Name", name: "companyName", locked: true },
    { label: "GST Number", name: "gstNumber" },
    { label: "Website", name: "website" },
    { label: "Phone No.", name: "phone", inputMode: "numeric", maxLength: 10 },
    { label: "Address", name: "address", textarea: true },
    { label: "Description", name: "description", textarea: true },
  ];

  if (loading) return <div className="card p-8"><div className="h-6 w-40 animate-shimmer rounded-lg mb-4" />{[1,2,3,4].map(i => <div key={i} className="h-12 animate-shimmer rounded-lg mb-3" />)}</div>;

  return (
    <div className="card p-8 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <div><h2 className="t-primary text-xl font-bold">Company Details</h2><p className="t-muted text-sm mt-0.5">Manage your company information</p></div>
        {!isEditing && <button onClick={() => setIsEditing(true)} className="btn-primary"><Pencil size={14} /> Edit Profile</button>}
      </div>

      <div className="space-y-4">
        {fields.map(({ label, name, locked, textarea, ...rest }) => (
          <div key={name}>
            <label className="t-secondary text-xs font-semibold block mb-1.5">{label}</label>
            {textarea ? (
              <textarea name={name} value={company[name] || ""} disabled={locked || !isEditing} onChange={handleChange}
                className={`input-themed ${locked || !isEditing ? "opacity-60 cursor-not-allowed" : ""}`} rows={2} />
            ) : (
              <input name={name} value={company[name] || ""} disabled={locked || !isEditing} onChange={handleChange}
                className={`input-themed !resize-y ${locked || !isEditing ? "opacity-60 cursor-not-allowed" : ""}`} {...rest} />
            )}
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="flex justify-end gap-3 mt-6 pt-4 bt-default">
          <button onClick={() => setIsEditing(false)} className="btn-secondary"><X size={14} /> Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><Save size={14} /> Save Changes</>}
          </button>
        </div>
      )}
    </div>
  );
};

export default CompanyProfileCard;