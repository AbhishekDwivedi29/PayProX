import { useEffect, useState } from "react";
import StatsSummary from "../../components/StatsSummary";
import ProfilePanel from "./ProfilePanel";
import DeployStore from "./DeployStore";
import TransactionsTable from "../transactions/TransactionTable";
import SettlementsTable from "../settlements/SettlementsTable";
import RefundsTable from "../refund/RefundTable";
import DashboardSidebar from "../../components/Navbar";
import DashboardLayout from "./DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { HiOutlineCreditCard, HiOutlineCurrencyRupee, HiOutlineBanknotes } from "react-icons/hi2";

export default function Dashboard() {
  const { logout, merchant, token } = useAuth();
  
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalVolume: 0,
    bankBalance: 0
  });
  const [selected, setSelected] = useState("summary"); 

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStats() {
    try {
      const [txRes, AmountRes] = await Promise.allSettled([
        axiosInstance.get("/merchant/transactions", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axiosInstance.get("/merchants/bank-info", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
       
        const txData = txRes.status === "fulfilled" ? txRes.value.data : { transactions: [] };
        const amountData = AmountRes.status === "fulfilled" ? AmountRes.value.data : { bankAmount: 0 };


       setStats({
            totalTransactions: txData.transactions.length,
            totalVolume: txData.transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0) / 100,
            bankBalance: amountData.bankAmount / 100
         });
  
      } catch (err) {
        setStats({
          totalTransactions: 0,
          totalVolume: 0,
          bankBalance: merchantBalance?.bankAmount / 100 || 0
        });
      }
    }
    if (token) fetchStats();
  }, [token, merchant]);




  const statsList = [
    {
      label: "Total Transactions",
      value: stats.totalTransactions,
      icon: HiOutlineCreditCard,
      color: "bg-blue-100 text-blue-700"
    },
    {
      label: "Total Volume",
      value: `₹${stats.totalVolume.toLocaleString()}`,
      icon: HiOutlineCurrencyRupee,
      color: "bg-green-100 text-green-700"
    },
    {
      label: "Bank Balance",
      value: `₹${stats.bankBalance.toLocaleString()}`,
      icon: HiOutlineBanknotes,
      color: "bg-yellow-100 text-yellow-700"
    }
  ];

  function handleLogout() {
    logout();
    navigate("/");
  }

  // Main content switch
  let MainPanel = null;
  switch (selected) {
    case "summary":
      MainPanel = <StatsSummary stats={statsList} />;
      break;
    case "transactions":
      MainPanel = <TransactionsTable />;
      break;
    case "settlements":
      MainPanel = <SettlementsTable />;
      break;
    case "refunds":
      MainPanel = <RefundsTable />;
      break;
    case "profile":
      MainPanel = <ProfilePanel />;
      break;
    case "orders":
      MainPanel = <DeployStore merchantId={merchant.merchantId}  status ={merchant.websiteDeployed}  token={token}/>;
      break;
    default:
      MainPanel = <StatsSummary stats={statsList} />;
  }

  return (
    <DashboardLayout user ={merchant}>
      <div className="min-h-screen bg-gray-50 py-8 px-2 flex">
        <div className="hidden md:block mr-8">
          <DashboardSidebar selected={selected} setSelected={setSelected} />
        </div>
        <div className="flex-1 max-w-4xl mx-auto">
          <div className="flex justify-end mb-4">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-semibold shadow"
            >
              Logout
            </button>
          </div>
          {MainPanel}
        </div>
      </div>
    </DashboardLayout>
  );
}



