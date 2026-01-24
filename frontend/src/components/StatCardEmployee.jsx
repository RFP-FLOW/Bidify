// components/StatCard.jsx
export default function StatCard({ title, count, icon, bg }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: bg }}>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h2 className="text-2xl font-bold">{count}</h2>
      </div>
      <div className="text-xl">{icon}</div>
    </div>
  );
}
