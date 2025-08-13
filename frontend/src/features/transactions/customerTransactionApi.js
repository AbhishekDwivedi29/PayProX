import customerAxios from "../../api/customerAxiosInstance";

export async function fetchCustomerTransactions(token) {
  try {
    const res = await customerAxios.get("/customers/transactions", {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data.transactions; 
  } catch (err) {
    throw (err.response?.data?.message || "Failed to fetch transactions./n Add your bank account");
  }
}
