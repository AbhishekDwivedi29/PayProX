import { useEffect, useState } from "react";
import { fetchMerchantRefunds } from "./refundAction";
import Table from "../../components/Table";
import RefundDetailsModal from "./RefundDetailModal";
import { useAuth } from "../../context/AuthContext";
import { HiOutlineArrowPath } from "react-icons/hi2";

export default function RefundsTable() {
  const { token } = useAuth();
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
        const data = await fetchMerchantRefunds(token);
        setRefunds(data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load refunds.");
      }
      setLoading(false);
    }
    if (token) load();
  }, [token]);

  // Filtering & sorting
  let filtered = refunds;
  if (statusFilter) filtered = filtered.filter(rf => rf.status === statusFilter);
  if (search) filtered = filtered.filter(rf => rf._id?.toLowerCase().includes(search.toLowerCase()));

  let sorted = [...filtered].sort((a, b) => {
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
    { key: "amount", label: "Amount" }
  ];

  const statusColors = {
    SUCCESS: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    COMPLETED: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    INITIATED: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    PENDING: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    REJECTED: "bg-red-100 text-red-700 border border-red-200"
  };



  function renderRow(refund) {
      const status = refund.status || "—";
      const badgeClass =
      "inline-block px-2 py-1 rounded-full text-xs font-semibold " +
      (statusColors[status] || "bg-gray-100 text-gray-600 border border-gray-200");
    return (
    <tr
      className="hover:bg-emerald-50 cursor-pointer transition"
      onClick={() => setSelected(refund)}
    >
      <td className="py-2 px-4">{new Date(refund.createdAt).toLocaleString()}</td>
      <td className="py-2 px-4">
        <span className={badgeClass}>{status}</span>
      </td>
      <td className="py-2 px-4">{refund.reason || "—"}</td>
      <td className="py-2 px-4 font-mono">{refund.amount/100 || "—"}</td>
    </tr>
  );
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-green-700 flex items-center gap-2 mb-2">
        <HiOutlineArrowPath className="inline text-green-600" />
        Recent Refunds
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
            <option value="COMPLETED">COMPLETED</option>
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

      <RefundDetailsModal
        open={!!selected}
        refund={selected}
        onClose={() => setSelected(null)}
        setRefunds={setRefunds}
      />
    </div>
  );
}
