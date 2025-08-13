import { Link } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext"; 

export default function DashboardLayout({user, children }) {
 
  const displayName =
    user?.businessName ||
    user?.ownerName ||
    user?.name ||
    user?.email?.split("@")[0] ||
    "User";

  // Avatar as initials
  function Avatar({ name }) {
    const initial = name?.[0]?.toUpperCase() || "U";
    return (
      <div className="w-10 h-10 bg-gradient-to-tr from-green-200 to-green-500 rounded-full flex items-center justify-center font-bold text-green-900 shadow-inner border-2 border-white select-none">
        {initial}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-green-50">
      <header className="sticky top-0 z-20 bg-gradient-to-r from-white via-green-50 to-green-100 shadow h-20 flex items-center px-8 border-b">
        <Link
          to="/dashboard"
          className="text-2xl font-extrabold text-green-700 tracking-tight hover:scale-105 hover:text-green-800 transition-transform"
        >
          PayProX
        </Link>
        <div className="flex-1" />
        <div className="flex items-center gap-5">
          <div className="flex flex-col items-end mr-2">
            <span className="text-base text-gray-600 font-medium">
              Welcome,
            </span>
            <span className="text-xl font-bold text-green-800">
              {displayName}
            </span>
          </div>
          <Avatar name={displayName} />
        </div>
      </header>

      <main className="flex-1 py-8 px-2 md:px-8">{children}</main>

      <footer className="text-xs text-gray-400 text-center py-3">
        © {new Date().getFullYear()} PayProX Payment Gateway
      </footer>
    </div>
  );
}
