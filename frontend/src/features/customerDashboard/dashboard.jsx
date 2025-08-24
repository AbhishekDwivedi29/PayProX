import { useEffect, useState } from "react";
import StatsSummary from "../../components/StatsSummary";
import CardsOverview from "../../components/cardsSummary";
import CustomerProfilePanel from "./ProfilePanel"; 
import Store from "./store";
import CustomerTransactionsTable from "../transactions/CustomerTransactionsTable"; 
import CustomerRefundsTable from "../refund/CustomerRefundsTable";
import CustomerSidebar from "../../components/Navbar"; 
import DashboardLayout from "../dashboard/DashboardLayout";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import { useNavigate } from "react-router-dom";
import customerAxios from "../../api/customerAxiosInstance"; 
import { HiOutlineCreditCard, HiOutlineCurrencyRupee, HiOutlineBanknotes } from "react-icons/hi2";

export default function CustomerDashboard() {
  const { logout, customer, token } = useCustomerAuth();
  const url = localStorage.getItem("merchantPublicUrl");
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalSpent: 0,
    cards: 0,
    bankBalance: 0
  });
  const [cards ,setCards] =useState("");
  const [selected, setSelected] = useState("summary");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStats() {

  try {
      const [txRes, AmountRes ,cardRes] = await Promise.allSettled([
        customerAxios.get("/customers/transactions", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        customerAxios.get("/customers/bank-info", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        customerAxios.get("/auth/card", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
        const txData = txRes.status === "fulfilled" ? txRes.value.data : { transactions: [] };
        const amountData = AmountRes.status === "fulfilled" ? AmountRes.value.data : { bankAmount: 0 };
        const cardData = cardRes.status === "fulfilled" ? cardRes.value.data.cards : { count: 0 };

        setStats({
            totalTransactions: txData.transactions.length,
            totalSpent: txData.transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0) / 100,
            cards: cardData.count,
            bankBalance: amountData.bankAmount / 100
         });
        setCards(cardData.cards);

        // const Amount = AmountRes.data;
        // const card = cardRes.data.cards;
        // setCards(card.cards);
        // console.log(Amount);
        // console.log(card);

        // console.log(txRes.data);
        // const transactionsReponse = txRes.data || [];
        // const totalSpent = transactionsReponse.transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);

        // setStats({
        //   totalTransactions: transactionsReponse.transactions.length,
        //   totalSpent: totalSpent / 100,
        //   cards: card?.count || 0,
        //   bankBalance:Amount?.bankAmount / 100 || 0
        // });
      } catch (err) {
        console.log("we got an error", err);
        console.error("Error fetching stats:", err?.response?.data);  
        setStats({
          totalTransactions: 0,
          totalSpent: 0,
          cards: card?.count || 0,
          bankBalance: Amount?.bankAmount / 100 || 0
        });
      }
    }
    if (token) fetchStats();
  }, [token, customer]);

  const statsList = [
    {
      label: "Total Transactions",
      value: stats.totalTransactions,
      icon: HiOutlineCreditCard,
      color: "bg-blue-100 text-blue-700"
    },
    {
      label: "Total Spent",
      value:`₹${stats.totalSpent.toLocaleString()}`,
      icon: HiOutlineCurrencyRupee,
      color: "bg-green-100 text-green-700"
    },
    {
      label: "Saved Cards",
      value: stats.cards,
      icon: HiOutlineBanknotes,
      color: "bg-yellow-100 text-yellow-700"
    },
    {
      label: "Bank Balance",
      value: `₹${stats.bankBalance.toLocaleString()}`,
      icon: HiOutlineBanknotes,
      color: "bg-gray-100 text-gray-700"
    }
  ];

  function handleLogout() {
    logout();
    navigate("/");
  }

  let MainPanel = null;
  switch (selected) {
    case "summary":
      MainPanel = <StatsSummary stats={statsList} />;
      break;
    case "transactions":
      MainPanel = <CustomerTransactionsTable />;
      break;
    case "refunds":
      MainPanel = <CustomerRefundsTable />;
      break;
    case "profile":
      MainPanel = <CustomerProfilePanel />;
      break;
    case "cards":
      MainPanel = <CardsOverview cards={cards} setCards={setCards} />;
      break;
    case "orders":
      MainPanel = <Store storeUrl={url} />;
      break;
    default:
      MainPanel = <StatsSummary stats={statsList} />;
  }

  return (
    <DashboardLayout user ={customer}>
      <div className="min-h-screen bg-gray-50 py-8 px-2 flex">
        {/* Sidebar */}
        <div className="hidden md:block mr-8">
          <CustomerSidebar selected={selected} setSelected={setSelected } type={customer} />
        </div>
        {/* Main Content */}
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