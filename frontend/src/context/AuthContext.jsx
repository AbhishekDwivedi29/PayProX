import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [merchant, setMerchant] = useState(() =>
    localStorage.getItem("merchant")
      ? JSON.parse(localStorage.getItem("merchant"))
      : null
  );

  const login = (token, merchant) => {
    setToken(token);
    setMerchant(merchant);
    localStorage.setItem("token", token);
    localStorage.setItem("merchant", JSON.stringify(merchant));
    if(merchant.websiteDeployed){ 
      const publicUrl = `${import.meta.env.VITE_MERCHANT_URL}/merchant?merchantId=${merchant.merchantId}`;
      // Store in localStorage
      localStorage.setItem("merchantPublicUrl", publicUrl);
    }
  };

  const logout = () => {
    setToken(null);
    setMerchant(null);
    localStorage.removeItem("token");
    localStorage.removeItem("merchant");
    localStorage.removeItem("merchantPublicUrl");

  };

  return (
    <AuthContext.Provider value={{ token, merchant, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
