import { MdStorefront } from "react-icons/md";

export default function StoreVisitCard({ storeUrl, storeName = "Visit Store" }) {
  if (!storeUrl || typeof storeUrl !== "string") {
    console.error("Invalid store URL:", storeUrl);
    return (
  <div className="bg-red-50 border border-red-300 text-red-700 px-6 py-4 rounded-md text-center shadow-sm">
    <p className="font-semibold text-lg">Store not deployed </p>
    <p className="mt-2 text-sm">
     Deploy the store by logging into the  <span className="font-medium text-red-600">Merchant Dashboard</span>.
    </p>
  </div>
);
  }


  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => window.open(storeUrl, "_blank")}
      onKeyDown={(e) => e.key === "Enter" && window.open(storeUrl, "_blank")}
      className="flex flex-col justify-center items-center h-40 p-6 rounded-xl border-2 border-dashed border-blue-400 text-blue-600 hover:bg-blue-50 cursor-pointer transition focus:outline-none focus:ring-2 focus:ring-blue-300"
      title={`Go to ${storeUrl}`}
    >
      <MdStorefront className="text-3xl mb-2 transform hover:scale-110 transition-transform" />
      <span className="text-sm font-semibold" title={storeUrl}>
        {storeName}
      </span>
    </div>
  );
}