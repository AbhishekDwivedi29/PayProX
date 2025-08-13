import Modal from "../../components/Modal";
import { approveRefund, rejectRefund } from "./refundAction";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { HiCheck, HiXMark } from "react-icons/hi2";

export default function RefundDetailsModal({ open, refund, onClose, setRefunds }) {
  const { token } = useAuth();
  const [rejecting, setRejecting] = useState(false);
  const [failReason, setFailReason] = useState("");

  if (!refund) return null;

  const statusColors = {
    SUCCESS: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    COMPLETED: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    INITIATED: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    PENDING: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    REJECTED: "bg-red-100 text-red-700 border border-red-200"
  };
  const badgeClass =
    "inline-block px-2 py-1 rounded-full text-xs font-semibold mb-2 " +
    (statusColors[refund.status] || "bg-gray-100 text-gray-600 border border-gray-200");

  async function handleApprove() {
    try {
      await approveRefund(refund._id, token);
      setRefunds(refs =>
        refs.map(r => r._id === refund._id ? { ...r, status: "SUCCESS" } : r)
      );
      onClose();
    } catch {
      alert("Failed to approve refund");
    }
  }

  async function handleReject() {
    if (!failReason) {
      alert("Please enter a rejection reason.");
      return;
    }
    try {
      await rejectRefund(refund._id, failReason, token);
      setRefunds(refs =>
        refs.map(r => r._id === refund._id ? { ...r, status: "REJECTED", failReason } : r)
      );
      onClose();
    } catch {
      alert("Failed to reject refund");
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Refund Details">
      <div className="space-y-3 text-gray-700">
        <div className="flex items-center gap-2">
          <b>ID:</b>
          <span className="font-mono">{refund._id}</span>
        </div>
        <div><b>Date:</b> {new Date(refund.createdAt).toLocaleString()}</div>
        <div>
          <b>Status:</b> <span className={badgeClass}>{refund.status}</span>
        </div>
        <div><b>Reason:</b> {refund.reason || "—"}</div>
        <div><b>Transaction:</b> <span className="font-mono">{refund.transactionId?.slice(-6) || "—"}</span></div>
        <div><b>Amount:</b> <span className="font-semibold text-green-700">₹{refund.amount ? (refund.amount / 100).toFixed(2) : "—"}</span></div>
        {refund.status === "REJECTED" && refund.failReason && (
          <div className="bg-red-50 border-l-4 border-red-400 px-3 py-2 rounded text-red-700">
            <b>Rejection Reason:</b> {refund.failReason}
          </div>
        )}
        {refund.status === "PENDING" && (
          <div className="flex flex-col gap-3 mt-6">
            {!rejecting ? (
              <div className="flex gap-4">
                <button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded px-4 py-2 font-semibold flex items-center gap-2 shadow"
                  onClick={handleApprove}
                >
                  <HiCheck size={18} /> Approve
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white rounded px-4 py-2 font-semibold flex items-center gap-2 shadow"
                  onClick={() => setRejecting(true)}
                >
                  <HiXMark size={18} /> Reject
                </button>
              </div>
            ) : (
              <form
                className="flex flex-col gap-2"
                onSubmit={e => {
                  e.preventDefault();
                  handleReject();
                }}
              >
                <input
                  type="text"
                  placeholder="Enter rejection reason"
                  value={failReason}
                  onChange={e => setFailReason(e.target.value)}
                  className="border border-red-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                  required
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white rounded px-4 py-2 font-semibold"
                    type="submit"
                  >
                    Confirm Reject
                  </button>
                  <button
                    className="bg-gray-300 hover:bg-gray-400 rounded px-3 py-2 text-gray-700 font-semibold"
                    type="button"
                    onClick={() => setRejecting(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}