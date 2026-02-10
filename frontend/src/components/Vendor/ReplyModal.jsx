import { useEffect, useState } from "react";
import axios from "axios";
import { useRef } from "react";

const ReplyModal = ({
  open,
  onClose,
  rfpId,
  existingReply = null,
  onSuccess,
}) => {
  const [message, setMessage] = useState("");
  const [quotedPrice, setQuotedPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const fileRef = useRef();

  const isEditMode = Boolean(existingReply);

  /* ---------------- Prefill existing reply ---------------- */
  useEffect(() => {
    if (existingReply) {
      setMessage(existingReply.message || "");
      setQuotedPrice(existingReply.quotedPrice || "");
    } else {
      setMessage("");
      setQuotedPrice("");
    }
  }, [existingReply]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!message.trim()) {
      setError("Message is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("rfpId", rfpId);
      formData.append("message", message);
      if (quotedPrice) formData.append("quotedPrice", quotedPrice);
      if (file) formData.append("attachment", file);

      await axios.post(
        "http://localhost:5000/api/vendor-reply/replies",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // ❌ DO NOT set Content-Type
          },
        },
      );

      onSuccess?.(rfpId);
      onClose();
    } catch (err) {
      console.error("Reply submit error:", err.response || err);
      setError(err.response?.data?.message || "Failed to send reply");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-md shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditMode ? "Edit Reply" : "Reply to RFP"}
          </h2>
        </div>

        {/* BODY */}
        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Message</label>
            <textarea
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full mt-1 border rounded-lg px-3 py-2 text-sm 
              focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your proposal message..."
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Quoted Price (optional)
            </label>
            <input
              type="number"
              value={quotedPrice}
              onChange={(e) => setQuotedPrice(e.target.value)}
              className="w-full mt-1 border rounded-lg px-3 py-2 text-sm 
              focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter quoted amount"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileRef.current.click()}
              className="text-xl text-blue-600 hover:scale-110 transition"
              title="Attach file"
            >
              📎
            </button>

            {file && (
              <span className="text-xs text-gray-600 truncate max-w-[200px]">
                {file.name}
              </span>
            )}

            <input
              ref={fileRef}
              type="file"
              hidden
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-1.5 text-sm rounded-md border 
            text-gray-600 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-1.5 text-sm rounded-md bg-blue-600 text-white 
            hover:bg-blue-700 active:scale-95 transition 
            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : isEditMode ? "Update Reply" : "Send Reply"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReplyModal;
