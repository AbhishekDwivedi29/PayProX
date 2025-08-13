// features/home/FeaturesSection.jsx
const features = [
  {
    title: "One-Click Integration",
    desc: "Easily connect with your website, mobile app, or e-commerce store.",
    icon: "🔌",
  },
  {
    title: "Robust Security",
    desc: "PCI DSS compliant, tokenized payments, and real-time fraud detection.",
    icon: "🛡",
  },
  {
    title: "Real-time Settlements",
    desc: "Instant settlement reports and T+2 automated payouts.",
    icon: "⚡",
  },
  {
    title: "Developer APIs",
    desc: "Clean REST APIs",
    icon: "💻",
  },
  {
    title: "Multi-payment Options",
    desc: "Cards, Netbanking payments your way.",
    icon: "💳",
  },
  {
    title: "Powerful Dashboard",
    desc: "Track transactions, manage refunds, and view analytics in real-time.",
    icon: "📊",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-700 text-center mb-8">
          Why Choose PayProX?
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="rounded-xl shadow hover:shadow-md p-6 bg-gray-50 border border-gray-100 transition"
            >
              <div className="text-3xl mb-2">{f.icon}</div>
              <div className="font-bold text-lg text-gray-800">{f.title}</div>
              <div className="text-gray-600 mt-1">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}