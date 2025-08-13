
import axiosInstance from "../../api/axiosInstance";



export async function fetchMerchantRefunds(token, merchantId) {
  try {
    const res = await axiosInstance.get(`/merchant/refunds`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    
    return res.data.refunds || [];
  } catch (err) {
    throw (err.response?.data?.message || "Failed to fetch refunds");
  }
}


export async function approveRefund(refundId, token) {
  const res = await axiosInstance.put(`/merchant/refunds/${refundId}/approve`, null, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  return res.data;
}

export async function rejectRefund(refundId, failReason, token) {
  await axiosInstance.put(`/merchant/refunds/${refundId}/reject`, { failReason }, {
    headers: { Authorization: `Bearer ${token}` }
  });
}


// export async function approveRefund(refundId, token) {
//   await fetch(`/merchant/refunds/${refundId}/approve`, {
//     method: "PUT",
//     headers: { Authorization: `Bearer ${token}` }
//   });
// }

// export async function rejectRefund(refundId, failReason, token) {
//   await fetch(`/merchant/refunds/${refundId}/reject`, {
//     method: "PUT",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({ failReason })
//   });
// }


