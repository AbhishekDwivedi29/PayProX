import axiosInstance from "../../api/axiosInstance";


export async function fetchMerchantSettlements(token) {
  try {
    const res = await axiosInstance.get("/merchant/settlements", {
      headers: { Authorization: `Bearer ${token}` }
    });

    return res.data.settlements || [];
  } catch (err) {
    throw (err.response?.data?.message || "Failed to fetch settlements");
  }
}


export async function RequestSettlements(token) {
  try {
    const res = await axiosInstance.get("/auth/run", {
      headers: { Authorization: `Bearer ${token}` }
    });

    return res.data.settlements || [];
  } catch (err) {
    throw (err.response?.data?.message || "Failed to run settlements");
  }
}
