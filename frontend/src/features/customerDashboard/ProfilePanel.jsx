import {Card,InfoRow} from "../../components/Card";
import { HiOutlineUserCircle, HiOutlineBanknotes } from "react-icons/hi2";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import { useState, useEffect } from "react";
import { fetchProfile, saveBankAccount } from "./customerApi"; 

// Mask account number for privacy
function maskAccountNumber(num = "") {
  return num.length >= 4 ? "" + num.slice(-4) : "—";
}

export default function CustomerProfilePanel() {
  const { token, customer: customerCtx } = useCustomerAuth();
  const [customer, setCustomer] = useState(customerCtx || null);
  const [loading, setLoading] = useState(!customerCtx);
  const [error, setError] = useState("");
  const [editingBank, setEditingBank] = useState(false);
  const [bankForm, setBankForm] = useState({
    accountHolderName: "",
    accountNumber: "",
    ifscCode: ""
  });
  const [bankStatus, setBankStatus] = useState("");


  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchProfile(token);
        setCustomer(data);
        if (data?.bankAccount) {
          setBankForm(data.bankAccount);
        }
      } catch (err) {
        setError(err.message || "Failed to load profile");
      }
      setLoading(false);
    }
    if (!customerCtx && token) load();
  }, [token, customerCtx]);


  function handleBankChange(e) {
    setBankForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleBankSubmit(e) {
    e.preventDefault();
    setBankStatus("Saving...");
    try {
      await saveBankAccount(token, bankForm, Object.keys(customer?.bankAccount || {}).length > 0);
      setCustomer(c => ({ ...c, bankAccount: { ...bankForm } }));
      setEditingBank(false);
      setBankStatus("Bank account updated!");
    } catch (err) {
      setBankStatus(" Failed to update bank account");
    }
  }

  if (loading) return <Card title="Profile">Loading…</Card>;
  if (error) return <Card title="Profile"><span className="text-red-600">{error}</span></Card>;
  if (!customer) return null;

  return (
    <Card
      title={
        <span className="flex items-center gap-2">
          <HiOutlineUserCircle className="text-3xl text-green-400" />
          Customer Profile
        </span>
      }
    >
      <InfoRow label="Full Name" value={<span className="font-bold text-green-700">{customer.name}</span>} />
      <InfoRow label="Email" value={customer.email} />
      <InfoRow label="Phone Number" value={customer.phoneNumber || "—"} />


      {/* BANK DETAILS */}
      <div className="mt-6 border-t pt-4">
        <div className="flex items-center gap-2 mb-2">
          <HiOutlineBanknotes className="text-2xl text-yellow-600" />
          <span className="font-semibold text-green-700">Bank Account</span>
        </div>
        {!editingBank && (
          <>
            {customer.bankAccount ? (
              <>
                <InfoRow label="Holder" value={customer.bankAccount.accountHolderName} />
                <InfoRow label="Account #" value={maskAccountNumber(customer.bankAccount.accountNumber)} />
                <InfoRow label="IFSC" value={customer.bankAccount.ifscCode} />
              </>
            ) : (
              <div className="text-gray-400 mb-2">No bank account added.</div>
            )}
            <button
              className="mt-2 px-4 py-1 rounded bg-green-600 text-white font-semibold text-sm hover:bg-green-700"
              onClick={() => setEditingBank(true)}
            >
              {customer.bankAccount ? "Edit" : "Add"} Bank Account
            </button>
          </>
        )}

        {/* Bank account form */}
        {editingBank && (
          <form onSubmit={handleBankSubmit} className="mt-2 space-y-2">
            <input
              name="accountHolderName"
              value={bankForm.accountHolderName}
              onChange={handleBankChange}
              placeholder="Account Holder Name"
              className="w-full border rounded px-3 py-2"
              required
            />
            <input
              name="accountNumber"
              value={bankForm.accountNumber}
              onChange={handleBankChange}
              placeholder="Account Number"
              className="w-full border rounded px-3 py-2"
              required
            />
            <input
              name="ifscCode"
              value={bankForm.ifscCode}
              onChange={handleBankChange}
              placeholder="IFSC Code"
              className="w-full border rounded px-3 py-2"
              required
            />
            <div className="flex gap-3 mt-2">
              <button
                className="bg-green-700 text-white rounded px-4 py-2 font-semibold"
                type="submit"
              >
                Save
              </button>
              <button
                type="button"
                className="bg-gray-200 text-gray-700 rounded px-4 py-2 font-semibold"
                onClick={() => setEditingBank(false)}
              >
                Cancel
              </button>
            </div>
            {bankStatus && <div className="text-sm mt-1">{bankStatus}</div>}
          </form>
        )}
      </div>
    </Card>
  );
}