import { useLocation, useNavigate } from "react-router-dom";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import { getCustomerDetails, initiatePayment } from "./paymentApi";
import { useState, useEffect } from "react";
import { HiOutlineCreditCard, HiCheckCircle, HiXCircle } from "react-icons/hi2";

export default function ConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    sessionId,
    cardToken,
    method,
    session
  } = location.state || {};

  const { token } = useCustomerAuth();

  const [customerDetails, setCustomerDetails] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);
  const [loading, setloading] = useState(null);
  

  // Fetch customer bank info
  useEffect(() => {
    async function fetchCustomerDetails() {
      try {
        const details = await getCustomerDetails(token);
        setCustomerDetails(details.customer.bankAccount);
      } catch (err) {
        setCustomerDetails(null);
      }
    }
    if (token) fetchCustomerDetails();
  }, [token]);


  // Handle merchant redirect after payment
  useEffect(() => {
    if (paymentResult) {
      const timer = setTimeout(() => {
      //   const merchantReturnUrl = session?.merchantReturnUrl || "http://localhost:5174/order-complete";
      //   const url = new URL(merchantReturnUrl);
      //   url.searchParams.set("sessionId", sessionId);
      //   url.searchParams.set("status", paymentResult.success ? "success" : "failure");
      //   window.location.replace(url.toString());
      navigate("/merchant/dashboard");
      }, 35000);
      return () => clearTimeout(timer);
    }
  }, [paymentResult, session, sessionId]);

 if (!loading && (!customerDetails || !session )) {
    return <div className="text-center py-10 text-blue-600 font-bold text-xl">Please wait few moments... loading your details </div>;
  }

  if (!session || !customerDetails) {
    return <div className="text-center py-10 text-red-600 font-bold text-xl">Missing confirmation data.</div>;
  }




  const payload = {
    currency: session.currency,
    amount: session.amount,
    merchantId: session.merchantId,
    method,
    customerDetails,
    token: cardToken,
  };

  async function handlePayment() {
    setPaymentResult(null);
    try {
      await initiatePayment(token, payload);
      setPaymentResult({
        success: true,
        message: "Payment Successful! Redirecting you back to the merchant…"
      });
    } catch (err) {
      setPaymentResult({
        success: false,
        message: (err?.response?.data?.message || err.message || "Payment failed. Try again!")
      });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 px-4">
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-8 space-y-6">

        {paymentResult && (
          <div className="flex flex-col items-center animate-fadeIn">
            {paymentResult.success ? (
              <HiCheckCircle className="text-green-600 text-5xl mb-2 animate-bounce" />
            ) : (
              <HiXCircle className="text-red-600 text-5xl mb-2 animate-pulse" />
            )}
            <div className={`text-xl font-bold mb-1 ${paymentResult.success ? "text-green-700" : "text-red-700"}`}>
              {paymentResult.message}
            </div>
            <div className="text-gray-500 text-base">
              You’ll be redirected to the merchant shortly…
            </div>
          </div>
        )}


        {!paymentResult && (
          <>
            <h2 className="text-2xl font-extrabold text-green-800 text-center mb-4 flex items-center justify-center gap-2">
              <HiOutlineCreditCard className="inline-block text-3xl" />
              Confirm Your Payment
            </h2>
            {/* Merchant Details */}
            <Section title="Merchant Details">
              <Display label="Order ID" value={session.orderId || "Not provided"} />
              <Display label="Merchant ID" value={session.merchantId} />
            </Section>

            {/* Customer Details */}
            <Section title="Customer Details">
              <Display label="Customer Name" value={customerDetails.accountHolderName} />
              <Display label="Bank IFSC" value={customerDetails.ifscCode} />
            </Section>

            {/* Transaction Details */}
            <Section title="Transaction Details">
              <Display label="Session ID" value={sessionId} />
              <Display label="Currency" value={session.currency || "INR"} />
              <Display label="Amount Requested" value={`₹${(session.amount/ 100).toLocaleString()}`} />
              <Display label="Payment Method" value={method} />
              <Display label="Amount to be Deducted" value={`₹${(session.amount/ 100).toLocaleString()}`} />
            </Section>
            <button
              onClick={handlePayment}
              className="w-full mt-6 bg-green-700 hover:bg-green-800 text-white py-3 rounded-lg font-bold shadow transition"
            >
              Confirm & Pay {`₹${(session.amount/ 100).toLocaleString()}`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mb-3">
      <h3 className="font-semibold text-green-700 mb-2">{title}</h3>
      <div className="space-y-2 text-sm">{children}</div>
    </div>
  );
}

function Display({ label, value }) {
  return (
    <div className="flex justify-between items-center py-0.5">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}
