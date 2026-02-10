import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";

function VendorVerifyOtp() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  
  useEffect(() => {
  if (!state?.email) {
    navigate("/vendor/register");
  }
}, [state, navigate]);
  useEffect(() => {
    if (timer === 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Enter valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/vendor/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: state.email,
            otp,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success("Vendor registered successfully 🎉");
      navigate("/vendor/login");

    } catch {
      toast.error("OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResendLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/vendor/resend-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: state.email }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success("OTP resent 📩");
      setTimer(30);

    } catch {
      toast.error("Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff5d7]">
      <Navbar />

      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <form
          onSubmit={handleVerify}
          className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
        >
          <h2 className="text-xl font-bold mb-4 text-center">
            Verify Vendor Email
          </h2>

          <p className="text-sm text-center mb-4">
            OTP sent to <b>{state.email}</b>
          </p>

          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border px-3 py-2 rounded mb-4 text-center tracking-widest"
            placeholder="Enter OTP"
          />

          <button
            disabled={loading}
            className="w-full bg-[#3a2d97] text-white py-2 rounded"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <div className="text-center mt-4">
            {timer > 0 ? (
              <p className="text-sm text-gray-500">
                Resend OTP in <b>{timer}s</b>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading}
                className="text-[#3a2d97] font-semibold hover:underline"
              >
                {resendLoading ? "Sending..." : "Resend OTP"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default VendorVerifyOtp;
