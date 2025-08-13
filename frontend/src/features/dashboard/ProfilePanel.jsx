import {Card,InfoRow} from "../../components/Card";
// import InfoRow from "../../components/InfoRow";
import { HiOutlineUserCircle, HiOutlineBanknotes } from "react-icons/hi2";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { fetchProfile, saveBankAccount } from "./profileApi";

function maskAccountNumber(num = "") {
  return num.length >= 4 ? "" + num.slice(-4) : "—";
}

export default function ProfilePanel({ merchantId }) {
  const { token, merchant: merchantCtx } = useAuth();
  const [merchant, setMerchant] = useState(merchantCtx || null);
  const [loading, setLoading] = useState(!merchantCtx && !merchantId);
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
        let data;
          data = await fetchProfile(token);
        
        setMerchant(data);
        if (data?.bankAccount) {
          setBankForm(data.bankAccount);
        }
      } catch (err) {
        setError(err.message || "Failed to load profile");
      }
      setLoading(false);
    }
    if ( !merchantCtx && token ) load();
  }, [token, merchantCtx]);


  // Handle changes in the bank account form
  function handleBankChange(e) {
    setBankForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  // Add/Update bank account
  async function handleBankSubmit(e) {
    e.preventDefault();
    setBankStatus("Saving...");
    try {
      await saveBankAccount(token, bankForm, !!merchant?.bankAccount);
      setMerchant(m => ({ ...m, bankAccount: { ...bankForm } }));
      setEditingBank(false);
      setBankStatus("Bank account updated!");
    } catch (err) {
      setBankStatus("Failed to update bank account");
    }
  }

  if (loading) return <Card title="Profile">Loading…</Card>;
  if (error) return <Card title="Profile"><span className="text-red-600">{error}</span></Card>;
  if (!merchant) return null;




  return (
    <Card
      title={
        <span className="flex items-center gap-2">
          <HiOutlineUserCircle className="text-3xl text-blue-400" />
          {merchant.merchantId ? "Shop Profile" : "Merchant Profile"}
        </span>
      }
    >
      <InfoRow label="Business Name" value={<span className="font-bold text-blue-700">{merchant.businessName}</span>} />
      <InfoRow label="Owner" value={merchant.ownerName} />
      <InfoRow label="Email" value={merchant.email} />
      <InfoRow label="Contact Number" value={merchant.contactNumber} />
      <InfoRow
        label="KYC Status"
        value={
          merchant.kycStatus && (
            <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
              merchant.kycStatus === "VERIFIED"
                ? "bg-green-100 text-green-700"
                : merchant.kycStatus === "PENDING"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}>
              {merchant.kycStatus}
            </span>
          )
        }
      />

      {/* BANK DETAILS */}
      {merchant.merchantId && (
        <div className="mt-6 border-t pt-4">
          <div className="flex items-center gap-2 mb-2">
            <HiOutlineBanknotes className="text-2xl text-yellow-600" />
            <span className="font-semibold text-blue-700">Bank Account</span>
          </div>
          {!editingBank && (
            <>
              {merchant.bankAccount ? (
                <>
                  <InfoRow label="Holder" value={merchant.bankAccount.accountHolderName} />
                  <InfoRow label="Account #" value={maskAccountNumber(merchant.bankAccount.accountNumber)} />
                  <InfoRow label="IFSC" value={merchant.bankAccount.ifscCode} />
                </>
              ) : (
                <div className="text-gray-400 mb-2">No bank account added.</div>
              )}
              <button
                className="mt-2 px-4 py-1 rounded bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700"
                onClick={() => setEditingBank(true)}
              >
                {merchant.bankAccount ? "Edit" : "Add"} Bank Account
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
      )}
    </Card>
  );
}

