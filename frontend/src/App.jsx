import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CustomerAuthProvider } from "./context/CustomerAuthContext";
import { useEffect } from "react";
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
 import CustomerDashboard from "./features/customerDashboard/dashboard";
 import TransactionPage from "./features/payment/Transaction";
 import ConfirmationPage from "./features/payment/ConfirmationPage";
// import CustomerProfile from "./features/customerDashboard/CustomerProfile";

// Reusable 404
const NotFound = () => <div className="text-center mt-12 text-xl">404 Not Found</div>;

function App() {

  useEffect(() => {
    console.log("frontend loaded"); 
    const services = [
    import.meta.env.VITE_CUSTOMER_SERVICE_URL,
    import.meta.env.VITE_TOKENIZATION_SERVICE_URL,
    import.meta.env.VITE_ACQUIRER_SERVICE_URL,
    import.meta.env.VITE_ISSUER_SERVICE_URL,
    import.meta.env.VITE_SETTLEMENT_ENGINE_URL,
    import.meta.env.VITE_RISK_ENGINE_URL,
    import.meta.env.VITE_MERCHANT_SERVICE_URL,
    import.meta.env.VITE_PAYMENT_GATEWAY_URL
    ];

   
    const fetchWithRetry = async (url, retries = 2, delay = 2000) => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return { url, status: res.status };
      } catch (err) {
        if (retries > 0) {
          console.warn(`⚠ ${url} failed (${err.message}), retrying...`);
          await new Promise(resolve => setTimeout(resolve, delay)); 
          return fetchWithRetry(url, retries - 1, delay); 
        } else {
          throw { url, error: err.message };
        }
      }
    };


    Promise.allSettled(services.map(url => fetchWithRetry(url)))
      .then(results => {
        console.group("🔄 Warm-up Results");
        results.forEach(result => {
          if (result.status === "fulfilled") {
            // console.log( `${result.value.url} -> ${result.value.status}`);
          } else {
            // console.error( `${result.reason.url} -> Failed (${result.reason.error})`);
          }
        });
        console.groupEnd();
      });
  }, []);


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