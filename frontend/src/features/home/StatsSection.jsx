const stats = [
  { label: "Merchants", value: "1,200+" },
  { label: "Avg. Uptime", value: "99.99%" },
  { label: "Transactions/sec", value: "200+" },
  { label: "Countries", value: "15+" },
];

export default function StatsSection() {
  return (
    <section className="py-8 bg-green-50">
      <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
        {stats.map(s => (
          <div key={s.label} className="flex flex-col items-center">
            <div className="text-3xl font-extrabold text-green-700">{s.value}</div>
            <div className="text-gray-700 text-sm mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}