import { useState, useEffect } from "react";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getPaymentDetails, fetchSavedCards, addCards } from "./paymentApi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function PaymentForm() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const { token } = useCustomerAuth();
  const navigate = useNavigate();

  // Session info
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState("");
  // Timer state
  const [timeLeft, setTimeLeft] = useState(null);

  // Card data
  const [savedCards, setSavedCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState("");
  const [addCard, setAddCard] = useState(false); 
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    saveCard: false,
  });
  // Error
  const [error, setError] = useState("");

  // Fetch session (merchant/amount)
  useEffect(() => {
    async function fetchSession() {
      setLoading(true);
      setError("");
      try {
        const res = await getPaymentDetails(token, sessionId);
        setSession(res.data);

       

        if (res.data.expiresAt) {
          const seconds = Math.max(0, Math.floor((res.data.expiresAt - Date.now()) / 1000));
  
          setTimeLeft(seconds);
        }
        } catch (err) {
        setError("Payment session invalid or expired.");
       }
      setLoading(false);
     }
    if (sessionId && token) fetchSession();
  }, [sessionId, token]);

  // Countdown timer logic
  useEffect(() => {
     if (!timeLeft && timeLeft !== 0) return;
     if (timeLeft <= 0) return;
     const timer = setInterval(() => {
      setTimeLeft(t => {
         if (t <= 1) {
          clearInterval(timer);
          setError("Session expired. Please restart payment.");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);


  // Fetch saved cards (once method is chosen as card)
  useEffect(() => {
    async function fetchCards() {
      try {
        setLoading(true);
        const cards = await fetchSavedCards(token);
        setSavedCards(cards.cards || []);
        setLoading(false);
      } catch {
        setSavedCards([]);
      }
    }
    if (method === "card" && token) {
      fetchCards();
    }
  }, [method, token]);

  function handleMethodSelect(e) {
    setMethod(e.target.value);
    setError("");
  }

  function handleCardSelect(e) {
    setSelectedCard(e.target.value);
    setAddCard(false);
  }


const handleAddCard = ({ target: { name, value } }) => {
  if (name === "expiryDate") {
    const mmyy = `${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear().toString().slice(-2)}`;

    setCardDetails((prev) => ({ ...prev, expiryDate: mmyy }));
  } else {
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  }
};


  async function handleCardSubmit(e) {
    e.preventDefault();
    if (addCard || selectedCard === "add-new") {
      try {

        const card = await addCards(cardDetails, token);
        navigate("/customer/confirm", {
          state: {
            sessionId,
            session,
            cardToken: card.token,
            method: "card"
          }
        });
      } catch {
        setError("Failed to add card.");
      }
    } else if (selectedCard) {
      navigate("/customer/confirm", {
        state: {
          sessionId,
          session,
          cardToken: selectedCard,
          method: "card"
        }
      });
    }
  }

function handleNetbankingContinue() {
  navigate(`/customer/netbanking-login?sessionId=${sessionId}`);
}

  // Helper for timer display
  function formatTime(secs) {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  // === THEMED LAYOUT STARTS HERE ===

  if (error) return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center text-red-700">{error}</div>
    </div>
  );
  if (!session) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-green-700 mb-2">Complete Your Payment</h2>
        {typeof timeLeft === "number" && (
          <div className={`mb-4 font-semibold text-center text-sm 
              ${timeLeft < 60 ? "text-red-600 animate-pulse" : "text-gray-500"}`}>
            Session expires in <span className="font-mono">{formatTime(timeLeft)}</span>
          </div>
        )}

        {/* Merchant/order summary */}
        <DisplayField label="Merchant ID" value={session.merchantId} />
        <DisplayField label="Amount (₹)" value={(session.amount/ 100).toLocaleString()}/>
        <DisplayField label="Currency" value={session.currency} />

        {/* Payment method select */}
        <div className="mt-4">
          <label className="block font-semibold mb-2">Select payment method</label>
          <select value={method} onChange={handleMethodSelect} className="border px-3 py-2 rounded w-full">
            <option value="">-- Choose --</option>
            <option value="card">Card</option>
            <option value="netbanking">Netbanking</option>
          </select>
        </div>
         {method === "card" && loading && (
            <div className="text-center py-10 text-blue-600 font-bold text-xl">
                    Please wait a few moments... loading your Saved Cards
               </div>
              )}

        {method === "card" && !loading && savedCards.length === 0 && (
           <div className="text-center py-10 text-gray-500 font-medium text-lg">
               No saved cards found.
           </div>
         )}
        {/* Card selection/add new */}
        {method === "card" && (
          <form onSubmit={handleCardSubmit} className="mt-4">
            <label className="block font-semibold mb-2">Select Card</label>
            {savedCards.length > 0 ? (
              <select value={selectedCard} onChange={handleCardSelect} className="border px-3 py-2 rounded w-full">
                <option value="">-- Choose saved card --</option>
                {savedCards.map(card => (
                  <option value={card.token} key={card.token}>
                     ****{card.cardLast4} (exp {card.cardExpiry})
                  </option>
                ))}
                <option value="add-new">+ Add New Card</option>
              </select>
            ) : (
              <button
                type="button"
                onClick={() => setAddCard(true)}
                className="text-blue-600 underline font-semibold"
              >
                + Add Card
              </button>
            )}
            {/* Add Card Input */}
            {(addCard || selectedCard === "add-new") && (
              <div className="mt-2 space-y-4">
                <label className="block font-semibold mb-1">Card Details</label>
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="Card Number (1234 5678 9012 3456)"
                  className="w-full border px-3 py-2 rounded"
                  value={cardDetails.cardNumber}
                  onChange={handleAddCard}
                  required
                />
                <div className="flex gap-4">
               <DatePicker
                  selected={cardDetails.expiryDate}
                  onChange={(date) =>
                  handleAddCard({ target: { name: "expiryDate", value: date } }) }
                  dateFormat="MM/yy"
                  showMonthYearPicker
                  minDate={new Date(new Date().getFullYear(), new Date().getMonth(), 1)}
                  placeholderText="Expiry (MM/YY)"
                  className="flex-1 border px-3 py-2 rounded w-full"
                />
                  <input
                    type="password"
                    name="cvv"
                    placeholder="CVV"
                    className="flex-1 border px-3 py-2 rounded"
                    value={cardDetails.cvv}
                    onChange={handleAddCard}
                    required
                  />
                </div>
                <div className="flex items-center mt-1">
                  <input
                    type="checkbox"
                    id="saveCard"
                    name="saveCard"
                    checked={cardDetails.saveCard || false}
                    onChange={handleAddCard}
                    className="mr-2 h-4 w-4"
                    value = "true"
                  />
                  <label htmlFor="saveCard" className="text-sm font-medium text-gray-700">
                    Saving this card for future payments
                  </label>
                </div>
              </div>
            )}
            <button
              type="submit"
              className="mt-6 bg-green-700 text-white px-6 py-2 rounded font-semibold w-full"
              disabled={!(selectedCard || (cardDetails.cardNumber && cardDetails.expiry && cardDetails.cvv))}
            >
              Confirm &amp; Pay
            </button>
          </form>
        )}

        {/* Netbanking */}
        {method === "netbanking" && (
          <div className="text-center mt-8">
            <button
              className="bg-blue-700 text-white px-6 py-2 rounded font-semibold w-full hover:bg-blue-800 transition"
              onClick={handleNetbankingContinue}
            >
              Continue to Netbanking Login
            </button>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="text-center text-red-700 py-4">{error}</div>
        )}
      </div>
    </div>
  );
}

// Reusable display field 
function DisplayField({ label, value }) {
  return (
    <div className="mb-2">
      <label className="block text-xs font-semibold text-gray-500">{label}</label>
      <div className="px-3 py-2 border rounded bg-gray-50 text-gray-800 font-mono">{value}</div>
    </div>
  );
}