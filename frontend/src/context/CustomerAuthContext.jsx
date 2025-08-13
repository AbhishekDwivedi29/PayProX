import { createContext, useContext, useState } from "react";

const CustomerAuthContext = createContext();

export function CustomerAuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("customerToken") || null);
  const [customer, setCustomer] = useState(() =>
    localStorage.getItem("customer")
      ? JSON.parse(localStorage.getItem("customer"))
      : null
  );

  const login = (token, customer) => {
    setToken(token);
    setCustomer(customer);
    localStorage.setItem("customerToken", token);
    localStorage.setItem("customer", JSON.stringify(customer));
  };

  const logout = () => {
    setToken(null);
    setCustomer(null);
    localStorage.removeItem("customerToken");
    localStorage.removeItem("customer");
  };

  return (
    <CustomerAuthContext.Provider value={{ token, customer, login, logout }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  return useContext(CustomerAuthContext);
}


