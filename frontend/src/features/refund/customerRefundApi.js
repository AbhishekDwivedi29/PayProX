import customerAxios from "../../api/customerAxiosInstance";

export async function fetchCustomerRefunds(token) {
  try {
    const res = await customerAxios.get("/customers/refunds", {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data.refunds || [];
  } catch (err) {
    throw err.response?.data?.message || "Failed to fetch refunds";
  }
}