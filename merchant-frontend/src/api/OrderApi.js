import merchantApi from "./merchantApiInstance";

export async function createOrder({ productId, amount, customerId ,merchantId}) {
  try {

    const res = await merchantApi.post("/auth/orders", {
      productId,
      amount,
      customerId,
      merchantId
    });
    

    return res.data;
   
  } catch (err) {
    throw err.response?.data || new Error("Failed to create order");
  }
}




export async function cancelOrder(sessionId) {

  return new Promise((resolve) => setTimeout(resolve, 500));
}

export async function requestRefund(sessionId) {
  
  return new Promise((resolve) => setTimeout(resolve, 500));
}
