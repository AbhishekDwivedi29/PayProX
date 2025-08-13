import { HiUserAdd, HiBriefcase } from "react-icons/hi";

export default function CTASection() {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none animate-pulse" />
      <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
        <h3 className="text-3xl font-extrabold mb-4 tracking-tight">
          🚀 Ready to get started?
        </h3>
        <p className="text-white/90 text-lg mb-8">
          Join us today as a Merchant or a Customer and start your journey.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-6">
          <a
            href="/merchant/register"
            className="flex items-center justify-center gap-2 bg-white text-blue-700 font-bold px-6 py-3 rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition transform duration-300"
          >
            <HiBriefcase className="text-xl" />
            Merchant Signup
          </a>
          <a
            href="/customer/register"
            className="flex items-center justify-center gap-2 bg-green-500 text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition transform duration-300"
          >
            <HiUserAdd className="text-xl" />
            Customer Signup
          </a>
        </div>
      </div>
    </section>
  );
}