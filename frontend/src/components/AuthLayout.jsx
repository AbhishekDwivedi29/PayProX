export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-200 via-white to-blue-200 flex flex-col">
      <header className="py-8 text-center">
        <span className="text-4xl font-extrabold text-green-800 tracking-tight">PayGateX</span>
        <div className="mt-2 text-lg text-gray-600">Powering modern digital commerce</div>
      </header>
      <main className="flex-1 flex items-center justify-center">
        <div className="bg-white bg-opacity-90 shadow-2xl rounded-2xl p-10 w-full max-w-md">
          {children}
        </div>
      </main>
      <footer className="py-4 text-center text-xs text-gray-400">© {new Date().getFullYear()} PayGateX</footer>
    </div>
  );
}
