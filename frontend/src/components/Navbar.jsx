import {  HiOutlineCreditCard, HiOutlineCurrencyRupee, HiOutlineBanknotes,HiOutlineShoppingBag, HiOutlineUserCircle, HiOutlineClipboard,HiOutlineUser } from "react-icons/hi2";

export default function DashboardSidebar({ selected, setSelected, type = "merchant" }) {
  const NAV_MERCHANT = [
    { key: "summary", label: "Summary", icon: HiOutlineUser },
    { key: "transactions", label: "Transactions", icon: HiOutlineCreditCard },
    { key: "settlements", label: "Settlements", icon: HiOutlineCurrencyRupee },
    { key: "refunds", label: "Refunds", icon: HiOutlineBanknotes },
    { key: "profile", label: "Profile", icon: HiOutlineUserCircle },
    { key: "orders", label: "Orders", icon: HiOutlineShoppingBag },
  ];
  const NAV_CUSTOMER = [
    { key: "summary", label: "Summary", icon: HiOutlineUser },
    { key: "transactions", label: "Transactions", icon: HiOutlineCreditCard },
    { key: "cards", label: "Cards", icon: HiOutlineCurrencyRupee },
    { key: "refunds", label: "Refunds", icon: HiOutlineBanknotes },
    { key: "profile", label: "Profile", icon: HiOutlineUserCircle },
     { key: "orders", label: "Orders", icon: HiOutlineClipboard },

  ];
  
  const NAV = type === "merchant" ? NAV_MERCHANT : NAV_CUSTOMER;

  return (
    <nav className="bg-white shadow-md h-full rounded-lg p-4 w-[220px] flex flex-col gap-2">
      {NAV.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg font-semibold
            transition-colors hover:bg-green-50 ${selected === key ? "bg-green-100 text-green-800" : "text-gray-700"}`}
          onClick={() => setSelected(key)}
        >
          <Icon className="text-xl" />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}