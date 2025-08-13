import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../feature/header";
import Footer from "../feature/footer";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";
import { cancelOrder, requestRefund } from "../api/OrderApi"; // mock API functions

export default function OrderComplete() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const sessionId = searchParams.get("sessionId");
  const status = searchParams.get("status"); // 'success' or 'failure'

  const merchantId = searchParams.get("merchantId"); // optional for header

  if (!sessionId || !status) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50 px-4">
        <Header merchantId={merchantId} />
        <div className="text-center py-10 text-red-600 text-lg font-semibold">
          Missing order information.
        </div>
        <Footer />
      </div>
    );
  }

  async function handleCancelOrder() {
    try {
      await cancelOrder(sessionId);
      alert("Order cancelled successfully.");
    } catch (err) {
      alert("Failed to cancel order: " + (err.message || "Unknown error"));
    }
  }

  async function handleRequestRefund() {
    try {
      await requestRefund(sessionId);
      alert("Refund requested successfully.");
    } catch (err) {
      alert("Failed to request refund: " + (err.message || "Unknown error"));
    }
  }

  function handleBookAgain() {
    navigate("/");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 px-4">
      <Header merchantId={merchantId} />
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center border border-gray-100">
        {status === "success" ? (
          <>
            <HiCheckCircle className="text-green-600 text-4xl mb-2 mx-auto" />
            <h2 className="text-2xl font-bold text-green-700 mb-2">Order Confirmed</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase! Your payment was successful.
            </p>
            <div className="flex flex-col gap-3">
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-semibold transition"
                onClick={handleCancelOrder}
              >
                Cancel Order
              </button>
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded font-semibold transition"
                onClick={handleRequestRefund}
              >
                Request Refund
              </button>
            </div>
          </>
        ) : (
          <>
            <HiXCircle className="text-red-600 text-4xl mb-2 mx-auto" />
            <h2 className="text-2xl font-bold text-red-700 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-6">
              Your payment was not successful. Please try again.
            </p>
            <button
              className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded font-semibold transition"
              onClick={handleBookAgain}
            >
              Book Again
            </button>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}