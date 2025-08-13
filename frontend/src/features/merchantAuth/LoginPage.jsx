import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginMerchant } from "./authApi";
import LoginForm from "../../components/LoginForm";
import AuthLayout from "../../components/AuthLayout";

export default function MerchantLoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleLogin({ email, password }) {
    setLoading(true);
    setError("");
    try {
      const data = await loginMerchant(email, password);
      login(data.token, data.merchant);
      navigate("/merchant/dashboard");
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  }

  return (
    <AuthLayout>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <LoginForm
          title="Merchant Login"
          onSubmit={handleLogin}
          loading={loading}
          error={error}
          role="merchant"
        />
        <div className="text-center mt-5">
          <span className="text-gray-500 text-sm">
            Don't have a merchant account?{" "}
            <Link to="/merchant/register" className="text-green-600 hover:underline font-medium">
              Create Account
            </Link>
          </span>
        </div>
        <div className="text-center mt-1">
          <span className="text-gray-400 text-xs">
            Are you a customer?{" "}
            <Link to="/customer/login" className="text-blue-600 hover:underline font-medium">
              Customer Login
            </Link>
          </span>
        </div>
      </div>
    </div>
   </AuthLayout>
  );
}


