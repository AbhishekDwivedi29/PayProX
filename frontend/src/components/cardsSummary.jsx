import { HiOutlinePlusCircle, HiOutlineCreditCard ,HiOutlineCheckCircle } from "react-icons/hi2";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "./Modal";
import { addCards } from "../features/payment/paymentApi";
import { useCustomerAuth } from "../context/CustomerAuthContext";


export default function CardsOverview({ cards = [] }) {
   const {token} = useCustomerAuth();

     if (!Array.isArray(cards)) {
        console.error("Expected 'cards' to be an array, but received:", cards);
        return <div>Error loading cards.</div>; 
      }

const [add, setAdd] = useState(false);
const [error , setError]= useState("");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    saveCard: true,
  });

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
      try {
        setAdd(false);
        const card = await addCards(cardDetails, token);
        alert("card added");
      } catch {
        setError("Failed to add card.");
      }
  }

  return (
      
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {cards.map((card, i) => (
        <div
          key={i}
          className="flex flex-col justify-between h-40 p-6 rounded-xl shadow-md bg-white border border-gray-200 hover:shadow-lg transition"
        >
          <div className="flex items-center gap-3">
            <HiOutlineCreditCard className="text-3xl text-blue-600" />
            <div>
              <div className="text-md font-bold">**** **** **** {card.cardLast4}</div>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            <b>Expiry:</b> {card.cardExpiry}
          </div>
        </div>
      ))}

      {/* Add Card Block */}
      <div
        className="flex flex-col justify-center items-center h-40 p-6 rounded-xl border-2 border-dashed border-emerald-400 text-emerald-600 hover:bg-emerald-50 cursor-pointer"
        onClick={() => { setAdd(true);
        }}
      >
        <HiOutlinePlusCircle className="text-3xl mb-2" />
        <span className="text-sm font-semibold">Add New Card</span>
      </div>


      <Modal
        open={!!add}
        onClose={() => setAdd(false)}
        title={
          <span className="flex items-center gap-2">
            <HiOutlineCheckCircle className="text-green-600" />
            ENTER CARD DETAILS 
          </span>
        }
      >
        {add && (
          <form onSubmit={handleCardSubmit} className="mt-4">
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
                            handleAddCard({ target: { name: "expiryDate", value: date } })
                          }
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
        
                    </div>
                       <button
                           type="submit"
                           className="mt-6 bg-green-700 text-white px-6 py-2 rounded font-semibold w-full"
                           disabled={( (cardDetails.cardNumber && cardDetails.expiry && cardDetails.cvv))}
                        >
              ADD CARD
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
}











