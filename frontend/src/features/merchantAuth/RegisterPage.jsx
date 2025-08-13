import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerMerchant } from "./authApi";
import { useAuth } from "../../context/AuthContext";
import MerchantRegisterForm from "../../components/MerchantRegisterForm";
import AuthLayout from "../../components/AuthLayout"; 

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleRegister(form) {
    setLoading(true);
    setError("");
    try {
      const data = await registerMerchant(form);
      login(data.token, data.merchant);
      navigate("/merchant/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed");
    }
    setLoading(false);
  }

  return (
    <AuthLayout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
          <MerchantRegisterForm
            title="Register as Merchant"
            onSubmit={handleRegister}
            loading={loading}
            error={error}
          />
          <div className="text-center mt-5">
            <span className="text-gray-500 text-sm">
              Already have an account?{" "}
              <a href="/merchant/login" className="text-green-600 hover:underline font-medium">
                Login
              </a>
            </span>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
