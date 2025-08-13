import PaymentForm from "./PaymentForm";
export default function TransactionPage() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 px-4">
      <div className="w-full max-w-lg">
        <div className="bg-white shadow-2xl rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-green-800 text-center mb-6">
            Make a Payment
          </h1>
          <PaymentForm  />
        </div>
      </div>
    </div>
  );
}