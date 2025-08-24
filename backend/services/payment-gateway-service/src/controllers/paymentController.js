const axios = require("axios");
const Transaction = require("../models/Transaction");

const initiatePayment = async (req, res) => {
  
  try {
   
    const { method, merchantId, amount, currency, token, netbanking } = req.body.payload;

    const customerId = req.customer.customerId;


    if (!method || !merchantId || !amount || !currency)
      return res.status(400).json({ message: "Missing required fields" });

    let paymentMeta = {};

    // ----- CARD FLOW -----
    if (method === "card") {
      if (!token) return res.status(400).json({ message: "Card token required" });

      const tokenRes = await axios.get(
        `${process.env.TOKENIZATION_SERVICE_URL}/verify-token/${token}`
      );
      paymentMeta = tokenRes.data;
     
    }
      
    // ----- NETBANKING FLOW -----
    else if (method === "netbanking") {
      if (!netbanking || !netbanking.username || !netbanking.sessionToken)
        return res.status(400).json({ message: "Netbanking login required" });

      // 1. Verify netbanking session with Issuer
      const loginVerifyRes = await axios.post(
        `${process.env.ISSUER_URL}/api/bank/login`,
        {
          username: netbanking.username,
          password: netbanking.sessionToken 
        }
      );
      if (!loginVerifyRes.data || !loginVerifyRes.data.sessionToken)
        return res.status(401).json({ message: "Netbanking login invalid or expired" });

      paymentMeta = {
        netbankingUsername: netbanking.username,
        sessionToken: netbanking.sessionToken
      };
    } else {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    // Call risk engine 
    const riskRes = await axios.post(
      `${process.env.RISK_ENGINE_URL}/assess`,
      {
        merchantId,
        amount,
        method,
        customerId,
        ...(method === "card" ? { cardLast4: paymentMeta.cardLast4 } : {}),
        ...(method === "netbanking" ? { netbankingUsername: paymentMeta.netbankingUsername } : {})
      }
    );
    if (riskRes.data.status === "REJECTED") {
      // console.error("Risk engine blocked payment:", riskRes.data.reason);
      return res.status(403).json({ message: "Blocked by Risk Engine", reason: riskRes.data.reason });
    }


    // Call acquirer service (as before)
    const acqRes = await axios.post(
      `${process.env.ACQUIRER_SERVICE_URL}/api/acquirer/process`,
      {
        merchantId,
        amount,
        currency,
        customerId,
        method,
        ...(method === "card" ? { cardMeta: paymentMeta } : {}),
        ...(method === "netbanking" ? { netbanking: paymentMeta } : {})
      }
    );

    const status = acqRes.data.status;

    
    // Save transaction
    await Transaction.create({
      merchantId,
      customerId,
      amount,
      currency,
      method,
      token,
      status,
      ...(method === "card" ? {
        cardLast4: paymentMeta.cardLast4,
        cardNetwork: paymentMeta.cardNetwork
      } : {}),
      ...(method === "netbanking" ? {
        netbankingUsername: paymentMeta.netbankingUsername
      } : {}),
      createdAt: new Date()
    });
    console.log("Transaction saved");
    res.json({ message: "Payment processed", status,  });

  } catch (err) {
    console.error("Payment error:", err?.response?.data || err.message);
    res.status(500).json({ message: "Payment failed" });
  }
};



const getCustomerTransactions = async (req, res) => {
  try {
    const customerId = req.customer.customerId;
    const transactions = await Transaction.find({ customerId }).sort({ createdAt: -1 });
    res.status(200).json({ transactions });
  } catch (err) {
    // console.error("Error fetching customer transactions:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};



const getSavedCards = async (req, res) => {
  try {
    const customerId = req.customer.customerId;

    const transactions = await Transaction.find({
      customerId,
      status: "SUCCESS"
    });

    
    const uniqueCards = {};
    transactions.forEach(tx => {
      if (!uniqueCards[tx.token]) {
        uniqueCards[tx.token] = {
          token: tx.token,
          last4: tx.cardLast4,
          network: tx.cardNetwork
        };
      }
    });

    const savedCards = Object.values(uniqueCards);

    res.status(200).json({ savedCards });
  } catch (err) {
    // console.error(" Error fetching saved cards:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
   

const tokenization = async (req, res) => {
  try {
    const { cardNumber, expiry, cvv, cardholderName } = req.body;
    const customerId = req.customer.customerId;


    if (!cardNumber || !expiry || !cvv) {
      return res.status(400).json({ message: "Missing card details" });
    }

    const tokenRes = await axios.post(
      `${process.env.TOKENIZATION_SERVICE_URL}/api/tokenize`, 
      {
        cardNumber,
        expiry,
        cvv,
        cardholderName,
        customerId
      }
    );

    return res.status(201).json({
      token: tokenRes.data.token, 
      last4: tokenRes.data.cardLast4,
      cardNetwork: tokenRes.data.cardNetwork
    });

  } catch (err) {
    // console.error("Tokenization error:", err?.response?.data || err.message);
    return res.status(500).json({ message: "Tokenization failed" });
  }
};

module.exports = { initiatePayment, getCustomerTransactions, getSavedCards ,tokenization};

