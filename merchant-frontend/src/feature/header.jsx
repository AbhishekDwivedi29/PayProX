export default function Header({ merchantId }) {
 
  return (
    <header className="w-full bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 border-b border-gray-300 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Brand Identity */}
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="ShopifyX logo"
            className="h-10 w-10 rounded-full shadow-md"
          />
          <div>
            <h1 className="text-gray-800 text-2xl font-semibold leading-tight tracking-wide">
              ShopifyX
            </h1>
            <span className="text-sm text-gray-500">Trusted fintech platform</span>
          </div>
        </div>

        {/* Navigation + Merchant Info */}
        <div className="flex items-center gap-6">
          <nav
            aria-label="Primary navigation"
            className="flex gap-6 text-gray-700 text-sm font-medium"
          >
            <a href="/" className="hover:text-blue-600 transition-colors duration-200">
              Home
            </a>
            <a href="#about" className="hover:text-blue-600 transition-colors duration-200">
              About
            </a>
            <a href="#support" className="hover:text-blue-600 transition-colors duration-200">
              Support
            </a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors duration-200">
              Pricing
            </a>
          </nav>

          {/* Merchant ID Display */}
          {merchantId && (
            <div className="text-xs text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-300 shadow-sm">
              Merchant ID: <span className="font-mono text-black-800">{merchantId}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}