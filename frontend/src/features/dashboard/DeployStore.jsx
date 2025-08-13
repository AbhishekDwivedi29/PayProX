import { useState } from "react";
import { MdStorefront } from "react-icons/md";
import { createPublicMerchantUrl ,MerchantUrl } from "./profileApi";


export default function MerchantDeployCard({ merchantId, status,token , merchantName = "Merchant" }) {
  const [publicUrl, setPublicUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  async function handleDeploy() {
    const confirm = window.confirm(`Do you want to deploy ${merchantName}?`);
    if (!confirm) return;

    setLoading(true);
    try { 
      const { publicUrl } = await createPublicMerchantUrl(merchantId);
      await MerchantUrl(token);
      setPublicUrl(publicUrl);
      const raw = localStorage.getItem("merchant");
      
      const merchant = JSON.parse(raw);
      merchant.websiteDeployed = true;
      localStorage.setItem("merchant", JSON.stringify(merchant));

    } catch (err) {
      alert("Deployment failed: " + (err.message || "Unknown error"));
    }
    setLoading(false);
  }

  
  async function viewWebsite() {
    setLoading(true);

    const publicUrl = localStorage.getItem("merchantPublicUrl");
     setPublicUrl(publicUrl);
    setLoading(false);
  }


  if (status) {
    return (
      <div  onClick={viewWebsite} className="flex flex-col justify-center items-center h-40 p-6 rounded-xl border-2 border-green-400 text-green-600">
        <MdStorefront className="text-3xl mb-2" />
        <span className="text-sm font-semibold">Deployed!</span>
        <a
          href={publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 text-sm text-green-600 underline hover:text-blue-800 hover:underline transition duration-200 ease-in-out"
        >
          View Public URL
        </a>
      </div>
    );
  } else {
    return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleDeploy}
      onKeyDown={(e) => e.key === "Enter" && handleDeploy()}
      className="flex flex-col justify-center items-center h-40 p-6 rounded-xl border-2 border-dashed border-purple-400 text-purple-600 hover:bg-purple-50 cursor-pointer transition focus:outline-none focus:ring-2 focus:ring-purple-300"
      title={`Deploy ${merchantName}`}
    >
      <MdStorefront className="text-3xl mb-2 transform hover:scale-110 transition-transform" />
      <span className="text-sm font-semibold">
        {loading ? "Deploying..." : publicUrl ? "Deployed!" : `Deploy ${merchantName}`}
      </span>

      {publicUrl && (
        <a
          href={publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 text-xs text-blue-600 underline"
        >
          View Public URL
        </a>
      )}
    </div>
  );
}}


