import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { fetchMerchantSettlements ,RequestSettlements} from "./settlementsApi";
import Table from "../../components/Table";
import Modal from "../../components/Modal";
import { HiOutlineBanknotes, HiOutlineCheckCircle } from "react-icons/hi2";

export default function SettlementsTable() {
  const { token } = useAuth();
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchMerchantSettlements(token);
        setSettlements(data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load settlements.");
      }
      setLoading(false);
    }
    if (token) load();
  }, [token]);

  const columns = [
    { key: "settledAt", label: "Date" },
    { key: "totalAmount", label: "Amount (₹)" },
    { key: "transactionCount", label: "Transactions" },
  ];

  function renderRow(s) {
    return (
      <tr
        key={s._id}
        className="hover:bg-green-50 cursor-pointer transition"
        onClick={() => setSelected(s)}
      >
        <td className="py-2 px-4">{s.settledAt ? new Date(s.settledAt).toLocaleString() : "—"}</td>
        <td className="py-2 px-4 font-mono">{s.totalAmount ? (s.totalAmount / 100).toFixed(2) : "—"}</td>
        <td className="py-2 px-4">{s.transactionCount || (s.transactions ? s.transactions.length : "—")}</td>
      </tr>
    );
  }


  const handleClick = async () => {
  try { 
    const result = await RequestSettlements(token);
    alert(result.message);
  } catch (err) {
    console.error('Settlement flow error:', err);
  }
};


  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-green-700 flex items-center gap-2">
           <HiOutlineBanknotes className="text-green-600" />
            Settlement History
        </h3>

     <button
       onClick={handleClick}
       className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded shadow hover:bg-blue-700 transition duration-200"
     >
       Run Settlement
     </button>
    </div>
      {loading && <div className="text-gray-500">Loading settlements…</div>}
      {error && <div className="text-red-600">{error}</div>}
      <Table columns={columns} data={settlements} renderRow={renderRow} />

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={
          <span className="flex items-center gap-2">
            <HiOutlineCheckCircle className="text-green-600" />
            Settlement Details
          </span>
        }
      >
        {selected && (
          <div className="space-y-2 text-gray-700">
            <div>
              <b>ID:</b> {selected._id}
            </div>
            <div>
              <b>Date:</b>{" "}
              {selected.settledAt
                ? new Date(selected.settledAt).toLocaleString()
                : "—"}
            </div>
            <div>
              <b>Total Amount:</b>{" "}
              ₹{selected.totalAmount ? (selected.totalAmount / 100).toFixed(2) : "—"}
            </div>
            <div>
              <b>Transactions:</b>{" "}
              {selected.transactionCount ||
                (selected.transactions ? selected.transactions.length : "—")}
            </div>
            {selected.transactions && selected.transactions.length > 0 && (
              <div>
                <b>Transaction IDs:</b>
                <ul className="ml-4 list-disc text-xs text-gray-600">
                  {selected.transactions.map(txid => (
                    <li key={txid}>{txid}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}