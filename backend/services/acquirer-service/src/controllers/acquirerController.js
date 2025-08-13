const axios = require("axios");
const MerchantBankAccount = require("../models/MerchantBankAccount");
/*Configurable acquirer fee  {
        merchantId,
        amount,
        currency,
        customerId,
        method,
        ...(method === "card" ? { cardMeta: paymentMeta } : {}),
        ...(method === "netbanking" ? { netbanking: paymentMeta } : {})
      }*/
const ACQUIRER_FEE_PERCENT = parseFloat(process.env.ACQUIRER_FEE_PERCENT) || 1.8;

exports.processPayment = async (req, res) => {
  try {
    const { merchantId, amount, currency, customerId, method, cardMeta, netbanking } = req.body;


    // Calculate the acquirer fee (rounded to nearest paise)
    const fee = Math.round((amount * ACQUIRER_FEE_PERCENT) / 100);
    const merchantAmount = amount - fee;

    // Call Issuer for funds deduction

//  await axios.post(
//       `${process.env.ISSUER_SERVICE_URL}/api/bank/credit`,
//       { customer: tx.customerId, amount: refund.amount, description: `Refund for tx ${tx._id}` },
//       { headers: { "x-internal-secret": process.env.ISSUER_INTERNAL_SECRET } }
//     );



    let issuerUrl = process.env.ISSUER_URL ;
    let issuerRes;
  try {
  if (method === "card") {
    issuerRes = await axios.post(
      `${issuerUrl}/bank/debit`,
      {
        customerId,
        merchantAmount,
        cardMeta
      },
      { headers: { "x-internal-secret": process.env.ISSUER_INTERNAL_SECRET } }
    );
  } else if (method === "netbanking") {
    issuerRes = await axios.post(
      `${issuerUrl}/bank/debit`,
      {
        customerId,
        merchantAmount,
        netbanking
      },
      { headers: { "x-internal-secret": process.env.ISSUER_INTERNAL_SECRET } }
    );
  } else {
    return res.status(400).json({ status: "DECLINED", reason: "Unknown payment method" });
  }
} catch (err) {
  // console.error("Issuer service error:", err?.response?.data || err.message);
  return res.status(500).json({
    status: "DECLINED",
    reason: "Issuer service error",
    error: err?.response?.data || err.message
  });
}
   

    if (issuerRes.data.status === "SUCCESS") {
      return res.json({
        status: "SUCCESS",
        merchantAmount,
        fee,
        feePercent: ACQUIRER_FEE_PERCENT,
        message: `Fee of ₹${(fee/100).toFixed(2)} deducted, merchant receives ₹${(merchantAmount/100).toFixed(2)}`
      });
    } else {
      return res.json({ status: "DECLINED", reason: issuerRes.data.reason || "Issuer declined" });
    }
  } catch (err) {
    return res.json({ status: "DECLINED", reason: err?.response?.data?.reason || "Error in acquirer" });
  }
};



exports.BankBalance = async (req, res) => {
  try {
  
    
    const { merchantId } = req.params;
    let account = await MerchantBankAccount.findOne({ merchantId });
    if (!account) return res.status(404).json({ message: "Merchant bank account not found" });

    res.json({ bankAmount: account.balance });
  } catch(err) {
    // console.error("Internal Fetch Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};









