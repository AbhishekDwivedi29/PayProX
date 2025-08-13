import axiosInstance from "../../api/axiosInstance";


export async function fetchMerchantTransactions(token) {
  try {
    const res = await axiosInstance.get("/merchant/transactions", {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data.transactions;
  } catch (err) {
    throw (err.response?.data?.message || "Failed to load transactions");
  }
}
