const DashboardLayout = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen bg-[#fff5d7] flex">
      <main className="flex-1 p-8">
        {/* HEADER */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            {title}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {subtitle}
          </p>
        </div>

        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
