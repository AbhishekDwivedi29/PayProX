import { useState } from "react";

export default function LoginForm({
  title = "Login",
  onSubmit,
  loading,
  error,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ email, password });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-2xl font-bold text-center text-green-700 mb-4">{title}</h2>
      <div>
        <label className="block mb-1 text-gray-600 font-medium">Email</label>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-400 transition"
          type="email"
          placeholder="Enter your email"
          autoComplete="username"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block mb-1 text-gray-600 font-medium">Password</label>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-400 transition"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <div className="text-red-600 text-center">{error}</div>}
      <button
        className="w-full py-2 bg-green-700 hover:bg-green-800 text-white rounded font-semibold shadow transition disabled:opacity-50"
        type="submit"
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}