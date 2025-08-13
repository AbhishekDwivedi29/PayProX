import { useEffect, useState } from "react";
import { fetchMerchantTransactions } from "./transactionApi";
import { useAuth } from "../../context/AuthContext";
import Table from "../../components/Table";
import Modal from "../../components/Modal";
import { HiOutlineCreditCard, HiOutlineDocumentDuplicate } from "react-icons/hi2";

export default function TransactionsTable() {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  // Filter/sort state
  const [statusFilter, setStatusFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [search, setSearch] = useState("");
  const [sortDir, setSortDir] = useState("desc");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchMerchantTransactions(token);
        setTransactions(data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load transactions.");
      }
      setLoading(false);
    }
    if (token) load();
  }, [token]);

  // Filtering and sorting
  let filtered = transactions;
  if (statusFilter)
    filtered = filtered.filter(txn => txn.status === statusFilter);
  if (methodFilter)
    filtered = filtered.filter(txn => (txn.method || "card") === methodFilter);
  if (search)
    filtered = filtered.filter(txn =>
      txn._id?.toLowerCase().includes(search.toLowerCase())
    );

  let sorted = [...filtered];
  sorted.sort((a, b) => {
    const da = new Date(a.createdAt), db = new Date(b.createdAt);
    return sortDir === "asc" ? da - db : db - da;
  });

function statusBadge(status) {
  switch (status) {
    case "SUCCESS":
      return "bg-green-100 text-green-700";
    case "REFUNDED":
      return "bg-yellow-100 text-yellow-700";
    case "DECLINED":
      return "bg-red-100 text-red-700";
    case "CHARGEBACK":
      return "bg-pink-100 text-pink-700";
    case "COMPLETE":
      return "bg-blue-100 text-blue-700";
    case "PENDING":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

  function renderRow(tx) {
    return (
      <tr
        key={tx._id}
        className="hover:bg-green-50 cursor-pointer transition"
        onClick={() => setSelected(tx)}
      >
        <td className="py-2 px-4">{new Date(tx.createdAt).toLocaleString()}</td>
        <td className="py-2 px-4 font-mono">{(tx.amount / 100).toFixed(2)}</td>
        <td className="py-2 px-4">
          <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${statusBadge(tx.status)}`}>
            {tx.status}
          </span>
        </td>
        <td className="py-2 px-4">{tx.method || "—"}</td>
       <td className="py-2 px-4">
          <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                statusBadge(tx.isSettled ? "COMPLETE" : "PENDING")
                }`}>
                {tx.isSettled ? "COMPLETE" : "PENDING"}
          </span>
        </td>
      </tr>
    );
  }

  // Themed header, filters, and table
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-green-700 flex items-center gap-2 mb-2">
        <HiOutlineCreditCard className="inline text-green-600" />
        Recent Transactions
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
            <option value="DECLINED">DECLINED</option>
            <option value="REFUNDED">REFUNDED</option>
            <option value="CHARGEBACK">CHARGEBACK</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">
            Type
          </label>
          <select
            value={methodFilter}
            onChange={e => setMethodFilter(e.target.value)}
            className="border border-emerald-200 rounded px-2 py-1 focus:ring-emerald-400"
          >
            <option value="">All</option>
            <option value="card">Card</option>
            <option value="netbanking">Netbanking</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">
            Search by Transaction ID
          </label>
          <input
            type="text"
            placeholder="Transaction ID"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-emerald-200 rounded px-2 py-1 focus:ring-emerald-400"
          />
        </div>
      </div>

      {loading && <div className="text-gray-500">Loading transactions…</div>}
      {error && <div className="text-red-600">{error}</div>}

      <Table
        columns={[
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
          { key: "amount", label: "Amount (₹)" },
          { key: "status", label: "Status" },
          { key: "method", label: "Type" },
          { key: "isSettled", label:"Settlement" }
        ]}
        data={sorted}
        renderRow={renderRow}
      />

      {/* Modal for transaction details */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={
          <div className="flex items-center gap-2">
            Transaction Details
            <button
              onClick={() => {
                navigator.clipboard.writeText(selected?._id || "");
              }}
              className="ml-2 p-1 bg-gray-100 rounded hover:bg-gray-200"
              title="Copy Transaction ID"
            >
              <HiOutlineDocumentDuplicate className="inline-block w-4 h-4 text-gray-500" />
            </button>
          </div>
        }
      >
        {selected && (
          <div className="space-y-2 text-gray-700">
            <div>
              <b>ID:</b> {selected._id}
            </div>
            <div>
              <b>Date:</b>{" "}
              {selected.createdAt &&
                new Date(selected.createdAt).toLocaleString()}
            </div>
            <div>
              <b>Amount:</b> ₹{(selected.amount / 100).toFixed(2)}
            </div>
            <div>
              <b>Status:</b>{" "}
              <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${statusBadge(selected.status)}`}>
                {selected.status}
              </span>
            </div>
            <div>
              <b>Method:</b> {selected.method || "card"}
            </div>
            <div>
              <b>Card Last 4:</b> {selected.cardLast4 || "—"}
            </div>
            <div>
              <b>Card Network:</b> {selected.cardNetwork || "—"}
            </div>
            <div>
              <b>Customer ID:</b> {selected.customerId || "—"}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}



