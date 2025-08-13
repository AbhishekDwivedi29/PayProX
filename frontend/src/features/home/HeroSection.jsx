export default function HeroSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-green-100">
      <div className="max-w-3xl mx-auto px-6 text-center">
       <span className="text-2xl font-bold text-blue-700 tracking-tight mb-4">
               PayPro<span className="text-green-600">X</span>
       </span>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">
          Modern Payment Gateway for Growing Businesses
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-8">
          Fast, Secure, and Developer-friendly platform for all your payment needs.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <a
            href="/merchant/register"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded font-semibold shadow-lg transition"
          >
            Create Merchant Account
          </a>
          <a
            href="/customer/register"
            className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded font-semibold shadow-lg transition"
          >
            Create Customer Account
          </a>
        </div>
      </div>
    </section>
  );
}