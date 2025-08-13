import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CustomerAuthProvider } from "./context/CustomerAuthContext";

// In App.jsx or your main router
import HomePage from "./features/home/HomePage";



// Merchant pages
import LoginPage from "./features/merchantAuth/LoginPage";
import RegisterPage from "./features/merchantAuth/RegisterPage";
import DashboardPage from "./features/dashboard/Dashboard";


// Customer pages
import CustomerLoginPage from "./features/customerAuth/CustomerLoginPage";
import CustomerRegisterPage from "./features/customerAuth/CustomerRegisterPage";
// import CustomerProfile from "./features/profile/CustomerProfile";
 import CustomerDashboard from "./features/customerDashboard/Dashboard";
 import TransactionPage from "./features/payment/Transaction";
 import ConfirmationPage from "./features/payment/ConfirmationPage";
// import CustomerProfile from "./features/customerDashboard/CustomerProfile";

// Reusable 404
const NotFound = () => <div className="text-center mt-12 text-xl">404 Not Found</div>;

function App() {
  return (
    <AuthProvider>
      <CustomerAuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Merchant routes */}
            <Route path="/merchant/login" element={<LoginPage />} />
            <Route path="/merchant/register" element={<RegisterPage />} />
            <Route path="/merchant/dashboard" element={<DashboardPage />} />


            {/* Customer routes */}
            <Route path="/customer/login" element={<CustomerLoginPage />} />
            <Route path="/customer/register" element={<CustomerRegisterPage />} />
            {/* <Route path="/customer/profile" element={<CustomerProfile />} /> */}
            {<Route path="/customer/dashboard" element={<CustomerDashboard />} /> }
  

            {<Route path="/customer/pay" element={<TransactionPage />} /> }
            {<Route path="/customer/confirm" element={<ConfirmationPage />} /> }

            {/* Redirect to login as fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CustomerAuthProvider>
    </AuthProvider>
  );
}

export default App;