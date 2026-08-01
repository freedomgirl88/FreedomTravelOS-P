export default function StatCard({ icon, label, value, sub, onClick }) {
  return (
    <button className="stat-card" onClick={onClick}>
      <span>{icon}</span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
        {sub && <p>{sub}</p>}
      </div>
    </button>
  );
}
