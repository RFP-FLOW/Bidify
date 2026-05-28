import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

function SetPassword({ role = "company" }) {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    const res = await fetch(
      `http://localhost:5000/api/auth/reset-password/${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          role,
        }),
      },
    );

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message);
    } else {
      toast.success("Password set successfully 🎉");
      navigate(role === "vendor" ? "/vendor/login" : "/company/login");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff5d7]">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-6 text-center">Set New Password</h2>

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New password"
            className="w-full border px-3 py-2 rounded pr-12"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3a2d97]"
          >
            {showPassword ? "🙈" : "👁"}
          </button>
        </div>

        <input
          type="password"
          placeholder="Confirm password"
          className="w-full border px-3 py-2 rounded mb-4"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button
          disabled={loading}
          className="w-full bg-[#3a2d97] text-white py-2 rounded"
        >
          {loading ? "Saving..." : "Set Password"}
        </button>
      </form>
    </div>
  );
}

export default SetPassword;
