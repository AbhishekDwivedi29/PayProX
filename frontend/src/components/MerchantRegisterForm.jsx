import { useState } from "react";

export default function MerchantRegisterForm({ role , title = "Merchant Registration", onSubmit, loading, error }) {
  const [form, setForm] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    merchantId: "",
    contactNumber: "",
    password: "",
  });

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-center text-green-700 mb-4">{title}</h2>
      <div>
        <label className="block mb-1 text-gray-600 font-medium">Business Name</label>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-400 transition"
          type="text"
          name="businessName"
          value={form.businessName}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block mb-1 text-gray-600 font-medium">Owner Name</label>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-400 transition"
          type="text"
          name="ownerName"
          value={form.ownerName}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block mb-1 text-gray-600 font-medium">Email</label>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-400 transition"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block mb-1 text-gray-600 font-medium">Merchant ID</label>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-400 transition"
          type="text"
          name="merchantId"
          value={form.merchantId}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block mb-1 text-gray-600 font-medium">Contact Number</label>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-400 transition"
          type="number"
          name="contactNumber"
          value={form.contactNumber}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block mb-1 text-gray-600 font-medium">Password</label>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-400 transition"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>
      {error && <div className="text-red-600 text-center">{error}</div>}
      <button
        className="w-full py-2 bg-green-700 hover:bg-green-800 text-white rounded font-semibold shadow transition disabled:opacity-50"
        type="submit"
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
}