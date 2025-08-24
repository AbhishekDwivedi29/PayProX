// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProductPage from "./pages/Merchant";
import OrderComplete from "./pages/Order";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductPage />} />
        <Route path="/merchant/:merchantId" element={<ProductPage />} />
         <Route path="/order-complete" element={<OrderComplete/>} />
      </Routes>
    </BrowserRouter>
  );
}