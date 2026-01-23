// components/RFPCard.jsx
export default function RFPCard({ title, desc, status, date }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">{title}</h3>
        <span className={`text-xs px-3 py-1 rounded-full ${
          status === "DRAFT" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"
        }`}>
          {status}
        </span>
      </div>

      <p className="text-sm text-gray-500 mt-1">{desc}</p>
      <p className="text-xs text-gray-400 mt-2">{date}</p>
    </div>
  );
}
