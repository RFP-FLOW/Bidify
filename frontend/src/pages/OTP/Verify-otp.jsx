import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

function VerifyOtp() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // 🚨 If user directly opens this page
  if (!state?.email) {
    navigate("/company/register");
    return null;
  }

  const handleVerify = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Enter valid 6-digit OTP");
      return;
    }

    setLoading(true);

    const res = await fetch(
      "http://localhost:5000/api/company/verify-otp",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          otp,
          email: state.email,
          companyName: state.companyName,
          username: state.username,
          password: state.password,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message);
    } else {
      toast.success("Company registered successfully 🎉");
      navigate("/company/login");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff5d7]">
      <form
        onSubmit={handleVerify}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4 text-center">
          Verify Email
        </h2>

        <p className="text-sm text-gray-600 mb-4 text-center">
          OTP sent to <b>{state.email}</b>
        </p>

        <input
          type="text"
          maxLength={6}
          placeholder="Enter 6-digit OTP"
          className="w-full border px-3 py-2 rounded mb-4 text-center tracking-widest"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          disabled={loading}
          className="w-full bg-[#3a2d97] text-white py-2 rounded"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
}

export default VerifyOtp;
