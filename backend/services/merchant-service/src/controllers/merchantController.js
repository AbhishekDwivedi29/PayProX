const Merchant = require("../models/Merchant");
const axios = require("axios");

const createBankAccount = async (req, res) => {
  try {

    const objectId = req.merchant.merchantId;


    const merchant = await Merchant.findById(objectId);
    if (!merchant) {
      return res.status(404).json({ message: "Merchant not found" });
    }

    const readableMerchantId = merchant.merchantId; 
   

      const payload = {
      merchantId: readableMerchantId,
      accountHolderName: req.body.accountHolderName || "DEFAULT_NAME",
      accountNumber: req.body.accountNumber || "DEFAULT_ACCOUNT",
      ifscCode: req.body.ifscCode || "DEFAULT_IFSC",
      initialBalance: req.body.balance ,
      lastUpdated: { type: Date, default: Date.now }
    };

    const response = await axios.post(`${process.env.ACQUIRER_SERVICE_URL}/bank/create`, payload, {
      headers: {
        "x-internal-secret": process.env.INTERNAL_SECRET_ACQUIRER // Optional auth header
      }
    });
    

    merchant.bankAccount = {
      accountHolderName: payload.accountHolderName,
      accountNumber: payload.accountNumber,
      ifscCode: payload.ifscCode
    };
    await merchant.save();

    res.status(201).json({
      message: "Bank account created successfully",
      accountDetails: response.data
    });

  } catch (err) {
    console.error(" Bank Account Init Error:", err.message);
    res.status(500).json({ message: "Failed to create bank account" });
  }
};



const updateBankAccount = async (req, res) => {
  try {
    const objectId = req.merchant.merchantId;
    

    const merchant = await Merchant.findById(objectId);
    if (!merchant) {
      return res.status(404).json({ message: "Merchant not found" });
    }

    const readableMerchantId = merchant.merchantId;


    const payload = {
      merchantId: readableMerchantId,
      accountHolderName: req.body.accountHolderName,
      accountNumber: req.body.accountNumber,
      ifscCode: req.body.ifscCode,
      balance: req.body.balance,
      lastUpdated: new Date()
    };

    Object.keys(payload).forEach(
      key => payload[key] === undefined && delete payload[key]
    );

   

    const response = await axios.put(
      `${process.env.ACQUIRER_SERVICE_URL}/bank/update`,
      payload,
      {
        headers: {
          "x-internal-secret": process.env.INTERNAL_SECRET_ACQUIRER
        }
      }
    );

    merchant.bankAccount = {
      accountHolderName: payload.accountHolderName ?? merchant.bankAccount.accountHolderName,
      accountNumber: payload.accountNumber ?? merchant.bankAccount.accountNumber,
      ifscCode: payload.ifscCode ?? merchant.bankAccount.ifscCode
    };
    await merchant.save();

    res.status(200).json({
      message: "Bank account updated successfully",
      updatedDetails: response.data
    });

  } catch (err) {
    // console.error(" Bank Account Update Error:", err.message);
    res.status(500).json({ message: "Failed to update bank account" });
  }
};


const refund = async (req, res) => {
  try {
    const objectId = req.merchant.merchantId;

    const merchant = await Merchant.findById(objectId);
    if (!merchant) {
      return res.status(404).json({ message: "Merchant not found" });
    }

    const readableMerchantId = merchant.merchantId;

    const response = await axios.get(
      `${process.env.PAYMENT_GATEWAY_URL}/refunds/merchant/${readableMerchantId}`
    );
    res.json(response.data);
  } catch (err) {
    // console.error("Merchant refund fetch error:", err.message);
    res.status(500).json({ message: "Failed to fetch refunds" });
  }
};



const approveRefund = async (req, res) => {
  try {
    const merchantId = req.merchant.merchantId;
    const { refundId } = req.params;

    const merchant = await Merchant.findById(merchantId);
    if (!merchant) {
      return res.status(404).json({ message: "Merchant not found" });
    }

    const readableMerchantId = merchant.merchantId; 


    const response = await axios.put(
      `${process.env.PAYMENT_GATEWAY_URL}/refunds/${refundId}/approve`,
      { merchantId: readableMerchantId }, 
      { headers: { "x-internal-token": process.env.INTERNAL_SECRET } }
    );



     const executeResponse = await axios.post(
            `${process.env.PAYMENT_GATEWAY_URL}/refunds/execute/${refundId}`,
        );
   
    res.status(response.status).json(response.data);
  } catch (err) {
    // console.error("Refund approve error:", err?.response?.data || err.message);
    res.status(err.response?.status || 500).json({ message: err.response?.data?.message || "Server error" });
  }
};



const rejectRefund = async (req, res) => {
  try {
    const merchantId = req.merchant.merchantId;
    const { refundId } = req.params;
    const { failReason } = req.body;

    const merchant = await Merchant.findById(merchantId);
    if (!merchant) {
      return res.status(404).json({ message: "Merchant not found" });
    }

    const readableMerchantId = merchant.merchantId; 
 

    const response = await axios.put(
      `${process.env.PAYMENT_GATEWAY_URL}/refunds/${refundId}/reject`,
      { merchantId: readableMerchantId, failReason },
      { headers: { "x-internal-token": process.env.INTERNAL_SECRET } }
    );
    res.status(response.status).json(response.data);
  } catch (err) {
    // console.error("Refund reject error:", err?.response?.data || err.message);
    res.status(err.response?.status || 500).json({ message: err.response?.data?.message || "Server error" });
  }
};


const transaction = async (req, res) => {
  try {
    const objectId = req.merchant.merchantId;

    const merchant = await Merchant.findById(objectId);
    if (!merchant) {
      return res.status(404).json({ message: "Merchant not found" });
    }

    const readableMerchantId = merchant.merchantId;

    const response = await axios.get(
      `${process.env.PAYMENT_GATEWAY_URL}/internal/transactions/by-merchant/${readableMerchantId}`
    );
    res.json({ transactions: response.data.transactions });
  } catch (err) {
    // console.error(" Error fetching transactions:", err.message);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
};


const Settlement = async (req, res) => {
  try {
    const objectId = req.merchant.merchantId;

    const merchant = await Merchant.findById(objectId);
    if (!merchant) {
      return res.status(404).json({ message: "Merchant not found" });
    }

    const readableMerchantId = merchant.merchantId; 

    const response = await axios.get(
      `${process.env.SETTLEMENT_SERVICE_URL}/settlements/${readableMerchantId}`
    );
    res.json(response.data);
  } catch (err) {
    // console.error(" Settlement Fetch Error:", err.message);
    res.status(500).json({ message: "Failed to fetch settlements" });
  }
};


module.exports = {
  createBankAccount,
  approveRefund,
  rejectRefund,
  refund,
  transaction,
  updateBankAccount,
  Settlement
};
