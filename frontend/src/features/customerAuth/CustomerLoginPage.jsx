import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import { loginCustomer } from "./customerAuthApi";
import LoginForm from "../../components/LoginForm";
import AuthLayout from "../../components/AuthLayout";

export default function CustomerLoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useCustomerAuth();
  const navigate = useNavigate();

  async function handleLogin({ email, password }) {
    setLoading(true);
    setError("");
    try {
      const data = await loginCustomer(email, password);
      login(data.token, data.customer);
      navigate("/customer/dashboard");
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  }

  return (
    <AuthLayout>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <LoginForm
          title="Customer Login"
          onSubmit={handleLogin}
          loading={loading}
          error={error}
          role="customer"
        />
        <div className="text-center mt-5">
          <span className="text-gray-500 text-sm">
            Don't have a customer account?{" "}
            <Link to="/customer/register" className="text-blue-600 hover:underline font-medium">
              Create Account
            </Link>
          </span>
        </div>
        <div className="text-center mt-1">
          <span className="text-gray-400 text-xs">
            Are you a merchant?{" "}
            <Link to="/merchant/login" className="text-green-600 hover:underline font-medium">
              Merchant Login
            </Link>
          </span>
        </div>
      </div>
    </div>
    </AuthLayout>
  );
}