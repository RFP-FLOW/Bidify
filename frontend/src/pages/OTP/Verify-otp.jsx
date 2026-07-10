import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

function VerifyOtp() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  // 🚨 If user directly opens this page
  useEffect(() => {
    if (!state?.email) {
      navigate("/company/register");
    }
  }, [state, navigate]);

  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleResendOtp = async () => {
    try {
      setResendLoading(true);

      await api.post("/company/resend-otp", {
        email: state.email,
      });

      toast.success("OTP resent successfully 📩");
      setTimer(30);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Enter valid 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      await api.post("/company/verify-otp", {
        otp,
        email: state.email,
        companyName: state.companyName,
        username: state.username,
        password: state.password,
      });

      toast.success("Company registered successfully 🎉");
      navigate("/company/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen  bg-[#fff5d7]">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <form
          onSubmit={handleVerify}
          className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
        >
          <h2 className="text-xl font-bold mb-4 text-center">Verify Email</h2>

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

          <div className="text-center mt-4">
            {timer > 0 ? (
              <p className="text-sm text-gray-500">
                Resend OTP in <span className="font-semibold">{timer}s</span>
              </p>
            ) : (
              <button
                onClick={handleResendOtp}
                disabled={resendLoading}
                className="text-[#3F2E96] font-semibold hover:underline"
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

export default VerifyOtp;
