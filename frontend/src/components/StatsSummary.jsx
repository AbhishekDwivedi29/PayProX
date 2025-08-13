export default function StatsSummary({
  stats
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, i) => (
        <div key={i} className={`flex items-center gap-4 p-4 rounded-xl shadow-sm ${stat.color} bg-opacity-80`}>
          <stat.icon className="text-3xl" />
          <div>
            <div className="text-xl font-bold">{stat.value}</div>
            <div className="text-xs font-semibold">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

