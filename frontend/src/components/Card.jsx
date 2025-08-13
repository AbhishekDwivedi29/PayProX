export function Card({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8 border">
      {title && <h3 className="text-lg font-semibold text-blue-700 mb-4">{title}</h3>}
      {children}
    </div>
  );
}

export function InfoRow({ label, value }) {
  return (
    <div className="flex items-center py-1">
      <span className="w-44 text-gray-600 font-medium">{label}</span>
      <span className="text-gray-900">
        {value || <span className="text-gray-400">—</span>}
      </span>
    </div>
  );
}

