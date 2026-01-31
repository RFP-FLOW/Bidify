import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className=" fixed top-0 z-50 bg-[#fff5d7]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">
        
        {/* Clickable Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/logo.png"   // <-- replace with your actual logo path
            alt="Bidify Logo"
            className="w-10 h-10 object-contain cursor-pointer"
          />
          <span className="text-xl font-semibold text-black tracking-wide">
            Bidify
          </span>
        </Link>

      </div>
    </header>
  );
}

export default Navbar;
