import { Link ,useNavigate} from "react-router-dom";
import { useEffect,useState,useRef } from "react";
import { User, LogOut } from "lucide-react";


function Navbar() {
  const navigate=useNavigate();
  const dropdownRef=useRef();

  const [user,setUser]=useState(null);
  const [open,setOpen]=useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
  const role = localStorage.getItem("role");

  localStorage.clear();

  if (role === "manager") {
    navigate("/company/login");
  } else if (role === "employee") {
    navigate("/employee/login");
  } else if (role === "vendor") {
    navigate("/vendor/login");
  } else {
    navigate("/login"); // fallback
  }
};


  const displayName =
    user?.companyName || user?.businessName || "User";

  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <header className="  w-full h-16 z-50 bg-[#fff5d7] backdrop-blur  shadow-md">
      <div className=" h-full flex items-center justify-between px-8 ml-64">
        
        {/* Clickable Logo */}
        <Link to="/" className="flex items-center gap-3                      " >
          <img
            src="/logo.png"   // <-- replace with your actual logo path
            alt="Bidify Logo"
            className="w-10 h-10 object-contain cursor-pointer"
          />
          <span className="text-2xl font-bold text-gray-900 text-black tracking-wide">
            Bidify
          </span>
        </Link>
         
         {/* RIGHT: Profile (only if logged in) */}
        {user && (
          <div className="flex items-center gap-4" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="  w-11 h-1 rounded-full mx-20 my-10
                          bg-[#3a2d97]
                          flex items-center justify-center
                          transition
                          focus:outline-none
                          focus-visible:ring-2
                          focus-visible:ring-[#3a2d97]
                                       focus-visible:ring-offset-2
                          focus-visible:ring-offset-[#fff5d7]">
              {/* Avatar */}
              <div className="mt-5 w-12 h-12 rounded-full bg-[#3a2d97] my-5
                              text-white flex items-center justify-center
                              font-bold text-xl">
                {avatarLetter}
              </div>
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 mt-3 w-72 bg-white top-full rounded-2xl
                              shadow-2xl border overflow-hidden">
                
                <div className="px-6 py-5">
                  <p className="font-bold text-lg text-gray-900 truncate">
                    {displayName}
                  </p>
                  <p className="text-sm text-gray-600 mt-1 truncate">
                    {user.email}
                  </p>
                </div>

                <div className="border-t" />

              <button
               onClick={handleLogout}
               className="
                 w-full flex items-center gap-4
                 px-6 py-4
                 text-base font-semibold
                 text-red-600
                 hover:bg-red-50
                 transition-all duration-200
               "
                 >
              <LogOut className="w-5 h-5 stroke-[2.2]" />
               Logout
             </button>
              </div>
            )}
          </div>
        )}

      </div>
    </header>
  );
}

export default Navbar;
