import customerAxios from '../../api/customerAxiosInstance';
import paymentAxios from '../../api/paymentAxiosInstance';

export async  function getPaymentDetails(token , sessionId ){
    try{
        const res =await customerAxios.get(`/auth/payment/${sessionId}`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        return res.data;
    }catch(err){
        console.error("Error fetching payment details:", err);
        throw new Error(err.response?.data?.message||"failed ")
    }}


export async function fetchSavedCards(token) {
  const res = await customerAxios.get("/auth/card", {
    headers: { Authorization: `Bearer ${token} `}
  });

  return res.data.cards || [];

}


export async  function addCards(  cardDetails ,token  ){
    try{
        const res =await customerAxios.post(`/auth/card`, cardDetails, {
            headers:{
                Authorization: `Bearer ${token}`
            }
        })

        return res.data;
    }catch(err){
        console.error("Error fetching payment details:", err);
        throw new Error(err.response?.data?.message||"failed ")
    }}


export async  function getCustomerDetails( token  ){
    try{
        const res =await customerAxios.get(`/auth/me`, {
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        return res.data;
    }catch(err){
        console.error("Error fetching payment details:", err);
        throw new Error(err.response?.data?.message||"failed ")
    }}



export async  function initiatePayment(token,payload ){
    try{
        const res =await paymentAxios.post(`/payments/initiate`,{payload},{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })

        return res.data;
    }catch(err){
        console.error("Error fetching payment details:", err);
        throw new Error(err.response?.data?.message||"failed ")
    }}








