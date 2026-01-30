import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Sidebar from "../../components/Employee/SidebarEmployee";
import { toast } from "react-toastify";


function CreateRFP() {
    const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get("draftId");
  const [prompt, setPrompt] = useState("");
  const [aiRFP, setAiRFP] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const hasLoadedDraft = useRef(false);

useEffect(() => {
  if (!draftId || hasLoadedDraft.current) return;

  hasLoadedDraft.current = true;

  const fetchDraft = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/rfp/${draftId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const draft = res.data;

      setPrompt(draft.description || "");
      setAiRFP({
        title: draft.title,
        items: draft.items || [],
      });

      toast.info("Draft loaded for editing");
    } catch (error) {
      console.error("Draft Load Error:", error);
      toast.error("Failed to load draft RFP");
    }
  };

  fetchDraft();
}, [draftId]);



  // 🔥 REAL AI GENERATION (Gemini backend)
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please describe your requirements");
      return;
    }

    try {
      setLoadingAI(true);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/rfp/generate",
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setAiRFP(res.data.data); // REAL AI OUTPUT
      toast.success("AI-generated RFP structure ready");
    } catch (error) {
      console.error("AI Generate Error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to generate RFP using AI"
      );
    } finally {
      setLoadingAI(false);
    }
  };

  // 🔁 Regenerate
  const handleRegenerate = () => {
    setAiRFP(null);
    handleGenerate();
  };

  // 📄 Create RFP (save to DB)
const handleCreateRFP = async () => {
  if (!aiRFP) {
    toast.error("Please generate RFP using AI first");
    return;
  }

  try {
    setSubmitting(true);
    const token = localStorage.getItem("token");

    let res;

    if (draftId) {
      // 🟡 UPDATE EXISTING DRAFT
      res = await axios.put(
        `http://localhost:5000/api/rfp/${draftId}`,
        {
          title:
            aiRFP.title && aiRFP.title.trim() !== ""
              ? aiRFP.title
              : "Procurement Request",
          description: prompt,
          items: aiRFP.items,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Draft updated successfully ✨");
    } else {
      // 🟢 CREATE NEW RFP
      res = await axios.post(
        "http://localhost:5000/api/rfp",
        {
          title:
            aiRFP.title && aiRFP.title.trim() !== ""
              ? aiRFP.title
              : "Procurement Request",
          description: prompt,
          items: aiRFP.items,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("RFP created successfully 🚀");
    }

    const rfpId = res.data.rfp._id;
    navigate(`/rfp/${rfpId}`);
  } catch (error) {
    console.error("Save RFP Error:", error);
    toast.error("Failed to save RFP");
  } finally {
    setSubmitting(false);
  }
};


  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-10">
        <h1 className="text-3xl font-bold text-center text-purple-700 mb-2">
          Request For Proposal
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Describe your requirements in natural language and let AI structure it for you
        </p>

        {/* Prompt */}
        <div className="max-w-4xl mx-auto mb-8">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Need 15 laptops with i7 processor and 3-year warranty"
            className="w-full h-32 p-4 border rounded-lg focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Generate Button */}
        <div className="max-w-4xl mx-auto mb-10">
          <button
            onClick={handleGenerate}
            disabled={loadingAI}
            className="w-full py-4 text-white text-lg font-semibold rounded-xl
              bg-gradient-to-r from-indigo-600 to-purple-600
              shadow-lg hover:opacity-90 transition"
          >
            {loadingAI ? "Generating with AI..." : "✨ Generate RFP Structure"}
          </button>
        </div>

        {/* AI Output */}
        {aiRFP && (
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 border">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-500 text-white rounded-full p-2">✨</div>
              <div>
                <h2 className="text-lg font-semibold">
                  AI-Generated Structure
                </h2>
                <p className="text-sm text-gray-500">
                  Review and create your RFP
                </p>
              </div>
            </div>

            <pre className="bg-slate-100 rounded-lg p-5 text-sm overflow-auto">
{JSON.stringify(aiRFP, null, 2)}
            </pre>

            {/* Bottom Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={handleRegenerate}
                className="px-6 py-3 rounded-lg border border-purple-500 text-purple-600 font-medium hover:bg-purple-50"
              >
                🔁 Regenerate
              </button>

              <button
                onClick={handleCreateRFP}
                disabled={submitting}
                className="px-8 py-3 rounded-lg text-white font-semibold
                  bg-gradient-to-r from-indigo-600 to-purple-600
                  hover:opacity-90"
              >
                {submitting ? "Creating..." : "📄 Create RFP"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateRFP;