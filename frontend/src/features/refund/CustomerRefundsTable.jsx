import { useEffect, useState } from "react";
import { fetchCustomerRefunds } from "./customerRefundApi";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import Table from "../../components/Table";
import Modal from "../../components/Modal";
import { HiOutlineArrowPath, HiOutlineDocumentDuplicate } from "react-icons/hi2";

function statusBadge(status) {
  switch (status) {
    case "SUCCESS":
      return "bg-green-100 text-green-700";
    case "PENDING":
      return "bg-yellow-100 text-yellow-700";
    case "REJECTED":
      return "bg-red-100 text-red-700";
    case "INITIATED":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function CustomerRefundsTable() {
  const { token } = useCustomerAuth();
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [sortDir, setSortDir] = useState("desc");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchCustomerRefunds(token);
        setRefunds(data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load refunds.");
      }
      setLoading(false);
    }
    if (token) load();
  }, [token]);

  // Filtering and sorting
  let filtered = refunds;
  if (statusFilter) filtered = filtered.filter(rf => rf.status === statusFilter);
  if (search)
    filtered = filtered.filter(rf =>
      rf._id?.toLowerCase().includes(search.toLowerCase())
    );

  let sorted = [...filtered];
  sorted.sort((a, b) => {
    const da = new Date(a.createdAt), db = new Date(b.createdAt);
    return sortDir === "asc" ? da - db : db - da;
  });


  const columns = [
    {
      key: "createdAt",
      label: (
        <span
          className="cursor-pointer select-none"
          onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
        >
          Date {sortDir === "asc" ? "▲" : "▼"}
        </span>
      )
    },
    { key: "status", label: "Status" },
    { key: "reason", label: "Reason" },
    { key: "transactionId", label: "Transaction" }
  ];

  // Table row renderer (with theme)
  function renderRow(rf) {
    return (
      <tr
        key={rf._id}
        className="hover:bg-green-50 cursor-pointer transition"
        onClick={() => setSelected(rf)}
      >
        <td className="py-2 px-4">{new Date(rf.createdAt).toLocaleString()}</td>
        <td className="py-2 px-4">
          <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${statusBadge(rf.status)}`}>
            {rf.status}
          </span>
        </td>
        <td className="py-2 px-4">{rf.reason || "—"}</td>
        <td className="py-2 px-4 font-mono">{rf.transactionId?.slice(-6) || "—"}</td>
      </tr>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-green-700 flex items-center gap-2 mb-2">
        <HiOutlineArrowPath className="inline text-green-600" />
        Your Refunds
      </h3>
      <div className="flex flex-wrap gap-4 items-end mb-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border border-emerald-200 rounded px-2 py-1 focus:ring-emerald-400"
          >
            <option value="">All</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="PENDING">PENDING</option>
            <option value="REJECTED">REJECTED</option>
            <option value="INITIATED">INITIATED</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">
            Search by Refund ID
          </label>
          <input
            type="text"
            placeholder="Refund ID"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-emerald-200 rounded px-2 py-1 focus:ring-emerald-400"
          />
        </div>
      </div>
      {loading && <div className="text-gray-500">Loading refunds…</div>}
      {error && <div className="text-red-600">{error}</div>}

      <Table columns={columns} data={sorted} renderRow={renderRow} />
      
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={
          <div className="flex items-center gap-2">
            Refund Details
            {selected && (
              <button
                onClick={() => navigator.clipboard.writeText(selected._id)}
                className="ml-2 p-1 bg-gray-100 rounded hover:bg-gray-200"
                title="Copy Refund ID"
              >
                <HiOutlineDocumentDuplicate className="inline-block w-4 h-4 text-gray-500" />
              </button>
            )}
          </div>
        }
      >
        {selected && (
          <div className="space-y-2 text-gray-700">
            <div><b>ID:</b> {selected._id}</div>
            <div><b>Date:</b> {selected.createdAt && new Date(selected.createdAt).toLocaleString()}</div>
            <div>
              <b>Status:</b>{" "}
              <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${statusBadge(selected.status)}`}>
                {selected.status}
              </span>
            </div>
            <div><b>Reason:</b> {selected.reason || "—"}</div>
            <div><b>Transaction:</b> {selected.transactionId || "—"}</div>
            <div>
              <b>Amount:</b> ₹{selected.amount ? (selected.amount / 100).toFixed(2) : "—"}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}