import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function LandingPage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-[#fff5d7]">
      <Navbar />

      <div className="flex flex-col items-center justify-center px-4 pt-40 text-center">

        {/* Creative Heading */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-black mb-4">
          Welcome to{" "}
          <span className="relative text-[#3a2d97]">
            Bidify
            <span className="absolute left-0 -bottom-2 w-full h-1 bg-[#3a2d97]/20 rounded-full"></span>
          </span>
        </h2>

        <p className="text-lg text-[#555] mb-16 max-w-xl leading-relaxed">
          A simple and secure platform connecting vendors and companies
          through an efficient RFP management system.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-10">

          {/* Vendor */}
          <button
            onClick={() => navigate("/vendor/login")}
            className="
              px-12 py-4
              bg-[#3a2d97]
              text-white text-lg font-semibold
              rounded-2xl
              shadow-lg
              transition-all duration-300
              hover:-translate-y-1
              hover:shadow-2xl
            "
          >
            Login as Vendor
          </button>

          {/* Company */}
          <button
            onClick={() => navigate("/company/login")}
            className="
              px-12 py-4
              bg-transparent
              border-2 border-[#3a2d97]
              text-[#3a2d97] text-lg font-semibold
              rounded-2xl
              transition-all duration-300
              hover:bg-[#3a2d97]/10
              hover:-translate-y-1
            "
          >
            Login as Company
          </button>

        </div>
      </div>
    </div>
  );
}

export default LandingPage;
