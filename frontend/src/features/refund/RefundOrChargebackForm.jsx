import { useState } from "react";
import customerAxios from "../../api/customerAxiosInstance";
import { useCustomerAuth } from "../../context/CustomerAuthContext";

export default function RefundOrChargebackForm({ transaction, type, onSuccess, onClose }) {
  const { token } = useCustomerAuth();
  const [reason, setReason] = useState("");
  const amount = transaction.amount / 100;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isRefund = type === "refund";

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const apiPath ="/customers/refunds/request" ;
      await customerAxios.post(
        apiPath,
        {
          transactionId: transaction._id,
           //amount: Math.round(amount * 100),
          reason,
        },
        { headers: { Authorization: `Bearer ${token}`} }
      );
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Request failed");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold mb-1">Amount (₹)</label>
        <input
          type="number"
          className="border border-gray-300 rounded px-2 py-1 w-full bg-gray-100"
          value={amount}
          readOnly
          />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Reason</label>
        <input
          type="text"
          className="border border-gray-300 rounded px-2 py-1 w-full"
          value={reason}
          onChange={e => setReason(e.target.value)}
          required
        />
      </div>
      {error && <div className="text-red-600">{error}</div>}
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          className="px-4 py-1 bg-gray-200 rounded"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`px-4 py-1 rounded text-white font-semibold ${isRefund ? "bg-yellow-500 hover:bg-yellow-600" : "bg-red-600 hover:bg-red-700"}`}
          disabled={loading}
        >
          {loading
            ? ("Requesting Refund...")
            : ("Request Refund" )}
        </button>
      </div>
    </form>
  );
}