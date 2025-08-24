export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-br from-gray via-gray-50 to-white text-gray-600 py-8 mt-16 border-t border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center px-6 gap-6 text-sm">
        <span className="text-center md:text-left">
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-bold text-blue-600">ShopifyX</span> — Crafting bold ideas.
        </span>
        <nav className="flex flex-wrap gap-4 justify-center md:justify-end">
          <a href="#" className="hover:text-blue-600 transition duration-200 ease-in-out">Privacy</a>
          <a href="#" className="hover:text-blue-600 transition duration-200 ease-in-out">Terms</a>
          <a href="#" className="hover:text-blue-600 transition duration-200 ease-in-out">Support</a>
          <a href="#" className="hover:text-blue-600 transition duration-200 ease-in-out">Careers</a>
        </nav>
      </div>
    </footer>
  );
}