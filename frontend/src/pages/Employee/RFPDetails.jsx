import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Employee/SidebarEmployee";
import { toast } from "react-toastify";
import SelectVendorsModal from "../../components/Employee/SelectVendorsModal";
import { PageLayout, PageContent, Card, StatusBadge, SectionLabel } from "../../components/ui/Themed";
import { Send, Package, Mail } from "lucide-react";

function RFPDetails() {
  const { rfpId } = useParams();
  const [rfp, setRfp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [vendorsLoading, setVendorsLoading] = useState(false);

  const fetchVendors = async () => {
    try { setVendorsLoading(true);
      const res = await axios.get("http://localhost:5000/api/manager-vendor/vendors/approved", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, withCredentials: true });
      setVendors(res.data.data || []);
    } catch (e) { console.error(e); toast.error("Failed to load vendors"); }
    finally { setVendorsLoading(false); }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/rfp/${rfpId}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, withCredentials: true });
        setRfp(res.data);
      } catch (e) { console.error(e); toast.error("Failed to load RFP details"); }
      finally { setLoading(false); }
    })();
  }, [rfpId]);

  if (loading) return (
    <PageLayout><Sidebar /><main className="page-content">
      <div className="h-8 w-64 rounded-lg animate-shimmer mb-3" /><div className="h-4 w-32 rounded-md animate-shimmer mb-8" />
      <div className="h-40 rounded-2xl animate-shimmer mb-6" /><div className="h-48 rounded-2xl animate-shimmer" />
    </main></PageLayout>
  );

  if (!rfp) return <PageLayout><Sidebar /><main className="page-content flex items-center justify-center"><p className="t-muted text-sm">RFP not found</p></main></PageLayout>;

  return (
    <PageLayout>
      <Sidebar />
      <main className="page-content">
        {/* Header */}
        <div className="flex justify-between items-start mb-8 animate-fadeIn">
          <div>
            <h1 className="t-primary text-2xl font-bold tracking-[-0.02em] mb-2">{rfp.title}</h1>
            <StatusBadge status={rfp.status} />
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setShowModal(true); fetchVendors(); }} className="btn-primary"><Send size={15} /> Send to Vendors</button>
          </div>
        </div>

        {/* Requirements */}
        <Card className="p-6 mb-6" delay={80}>
          <h2 className="t-primary text-sm font-semibold mb-3">Requirements</h2>
          <p className="t-secondary text-sm leading-relaxed">{rfp.description || "No description provided"}</p>
        </Card>

        {/* Items */}
        {rfp.items?.length > 0 && (
          <Card className="p-6 mb-6" delay={160}>
            <SectionLabel icon={Package}>Items ({rfp.items.length})</SectionLabel>
            <div className="rounded-xl overflow-hidden b-default">
              {rfp.items.map((item, idx) => (
                <div key={idx} className={`px-4 py-3 flex items-center justify-between text-sm ${idx % 2 === 0 ? "bg-input" : "bg-card"}`}
                  style={{ borderBottom: idx < rfp.items.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
                  <span className="t-primary font-medium">{item.name}</span>
                  <span className="t-muted text-xs font-semibold">Qty: {item.quantity}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Structured Data */}
        <Card className="p-6 mb-6" delay={240}>
          <details>
            <summary className="t-secondary text-sm font-semibold cursor-pointer">View Structured Data</summary>
            <pre className="mt-3 rounded-xl p-4 text-xs overflow-auto bg-input t-secondary b-subtle">
              {JSON.stringify({ title: rfp.title, items: rfp.items, budget: rfp.budget || null, deadline: rfp.deadline || null, paymentTerms: rfp.paymentTerms || null, warranty: rfp.warranty || null }, null, 2)}
            </pre>
          </details>
        </Card>


      </main>
      <SelectVendorsModal isOpen={showModal} onClose={() => setShowModal(false)} vendors={vendors} loading={vendorsLoading} rfpId={rfp._id} />
    </PageLayout>
  );
}

export default RFPDetails;
