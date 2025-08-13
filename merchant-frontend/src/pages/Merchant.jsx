import { useState } from "react";
import { createOrder } from "../api/OrderApi";
import { HiStar, HiOutlineMinusSm, HiOutlinePlusSm, HiCheckCircle } from "react-icons/hi";
import Header from "../feature/header";
import Footer from "../feature/footer";
import { useSearchParams } from "react-router-dom";

export default function ProductPage() {




  const [searchParams] = useSearchParams();
  const merchantId = searchParams.get("merchantId");


  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [ordered, setOrdered] = useState(false);

  // Demo product (in real app, fetch from backend)
  const product = {
    id: "prod_abc123",
    name: "Super Headphones",
    price: 259, // ₹2599.00 (in paise)
    description: "High-quality sound, wireless, noise-cancelling.",
    merchantId: merchantId || "merchant_123",
    rating: 4.5,
    reviews: 231,
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=500&q=80",
    inStock: 15,

    shipping: "Free shipping | Delivery in 2-4 days",
    returnPolicy: "10-day easy return",
  };

  // Fake customer
  const customerId = "customer_xyz";

  async function handleBuyNow() {
    setLoading(true);
    try {
      const { sessionUrl } = await createOrder({
        productId: product.id,
        amount: product.price * quantity,
        merchantId: product.merchantId,
        customerId,
        quantity,
      });
      setOrdered(true); // Show feedback (optional, will redirect soon)
      setTimeout(() => {
        window.open(sessionUrl, "_blank");
        setOrdered(false);
      }, 800); // show check animation for 0.8s before redirect
    } catch (err) {
      alert("Order error: " + (err.message || "Could not create order"));
    }
    setLoading(false);
  }

  // For star ratings
  function Stars({ rating }) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return (
      <span className="flex items-center">
        {[...Array(full)].map((_, i) => (
          <HiStar key={i} className="text-yellow-400 inline-block" />
        ))}
        {half && <HiStar className="text-yellow-300 opacity-70 inline-block" />}
        <span className="ml-1 text-gray-500 text-sm">({product.reviews} reviews)</span>
      </span>
    );
  }

  return (

    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 px-4">
      <Header merchantId={merchantId} />
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full flex flex-col md:flex-row overflow-hidden border border-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full md:w-2/5 h-60 object-cover md:rounded-l-2xl"
        />
        <div className="flex-1 p-8 flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-green-800 mb-1">{product.name}</h2>
          <Stars rating={product.rating} />
          <p className="text-gray-600 text-sm mb-3">{product.description}</p>

          {product.offer && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs rounded px-2 py-1 mb-2 w-fit">
              {product.offer}
            </div>
          )}

          <div className="flex items-center gap-4 my-2">
            <div className="text-2xl font-bold text-green-700">₹{(product.price / 100).toLocaleString()}</div>
            <div className={`text-sm font-semibold ${product.inStock > 0 ? "text-green-600" : "text-red-500"}`}>
              {product.inStock > 0 ? "In Stock" : "Out of Stock"}
            </div>
          </div>

          {/* Quantity selector */}
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="bg-gray-100 rounded-full p-1 hover:bg-gray-200 disabled:opacity-50"
              type="button"
            >
              <HiOutlineMinusSm className="text-xl" />
            </button>
            <span className="font-mono text-lg">{quantity}</span>
            <button
              onClick={() => setQuantity(q => Math.min(product.inStock, q + 1))}
              disabled={quantity >= product.inStock}
              className="bg-gray-100 rounded-full p-1 hover:bg-gray-200 disabled:opacity-50"
              type="button"
            >
              <HiOutlinePlusSm className="text-xl" />
            </button>
            <span className="text-sm text-gray-500 ml-2">({product.inStock} available)</span>
          </div>

          {/* Subtotal */}
          <div className="mb-2 text-base text-gray-600">
            Subtotal: <span className="font-semibold text-green-700">₹{((product.price * quantity) / 100).toLocaleString()}</span>
          </div>

          {/* Shipping/returns */}
          <div className="text-xs text-gray-500 mb-1">{product.shipping}</div>
          <div className="text-xs text-gray-500 mb-3">{product.returnPolicy}</div>

          {/* Buy Now */}
          <button
            onClick={handleBuyNow}
            disabled={loading || product.inStock === 0}
            className="bg-blue-700 hover:bg-blue-800 text-white py-3 px-6 rounded-lg shadow font-semibold transition disabled:opacity-60 w-full mt-2"
          >
            {ordered ? (
              <span className="flex items-center justify-center gap-2">
                <HiCheckCircle className="text-xl animate-bounce" />
                Redirecting…
              </span>
            ) : loading ? "Processing..." : "Buy Now"}
          </button>
        </div>
    
      </div>
      
       <Footer />
    
    </div>
    
  );
}







