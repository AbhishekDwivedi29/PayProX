import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow sticky top-0 z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <Link to="/" className="font-extrabold text-2xl text-green-700 tracking-tight">
           <span className={"text-2xl font-bold text-blue-700 tracking-tight "}>
              PayPro<span className="text-green-600">X</span>
           </span>
        </Link>
        <div className="flex gap-3 items-center">
          {/* Login Dropdown */}
          <div className="relative group">
            <button className="font-semibold px-4 py-2 rounded hover:bg-green-50">
              Login
            </button>
            <div className="absolute hidden group-hover:block bg-white shadow-lg rounded py-2 w-44 right-0 top-full z-30">
              <Link
                to="/merchant/login"
                className="block px-4 py-2 hover:bg-green-100 text-gray-700"
              >
                Merchant Login
              </Link>
              <Link
                to="/customer/login"
                className="block px-4 py-2 hover:bg-green-100 text-gray-700"
              >
                Customer Login
              </Link>
            </div>
          </div>
    

          {/* Signup Dropdown */}
          <div className="relative group">
            <button className="font-semibold px-4 py-2 rounded hover:bg-blue-50">
              Sign Up
            </button>
            <div className="absolute hidden group-hover:block bg-white shadow-lg rounded py-2 w-44 right-0 top-full z-30">
              <Link
                to="/merchant/register"
                className="block px-4 py-2 hover:bg-blue-100 text-gray-700"
              >
                Merchant Signup
              </Link>
              <Link
                to="/customer/register"
                className="block px-4 py-2 hover:bg-blue-100 text-gray-700"
              >
                Customer Signup
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}