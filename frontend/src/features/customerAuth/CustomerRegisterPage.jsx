import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerCustomer } from "./customerAuthApi";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import RegisterForm from "../../components/RegisterForm";
import AuthLayout from "../../components/AuthLayout";

export default function CustomerRegisterPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useCustomerAuth();
  const navigate = useNavigate();

  async function handleRegister(form) {
    setLoading(true);
    setError("");
    try {
      const data = await registerCustomer(form);
      login(data.token, data.customer);
      navigate("/customer/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed");
    }
    setLoading(false);
  }

  return (
    <AuthLayout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-gray-100">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <RegisterForm
            title="Customer Registration"
            onSubmit={handleRegister}
            loading={loading}
            error={error}
          />
          <div className="text-center mt-5">
            <span className="text-gray-500 text-sm">
              Already have an account?{" "}
              <a href="/customer/login" className="text-blue-600 hover:underline font-medium">
                Login
              </a>
            </span>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}