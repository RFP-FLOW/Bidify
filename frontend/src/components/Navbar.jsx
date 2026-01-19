function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-beige">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center gap-3">
        
        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg shadow-sm">
          B
        </div>

        <span className="text-xl font-semibold text-blackPure tracking-wide">
          Bidify
        </span>
      </div>
    </header>
  );
}

export default Navbar;
