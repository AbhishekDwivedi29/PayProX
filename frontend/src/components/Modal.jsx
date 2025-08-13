export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative animate-modalPop overflow-y-auto max-h-[90vh]">
        <button
          className="absolute right-4 top-4 text-2xl text-gray-400 hover:text-blue-700"
          onClick={onClose}
          aria-label="Close modal"
        >×</button>
        {title && (
          <div className="mb-4 flex items-center gap-2">
            {typeof title === "string"
              ? <h3 className="text-xl font-bold text-green-700">{title}</h3>
              : title}
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
}


