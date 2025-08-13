const Customer= require("../models/Customer");
const axios = require("axios");

const createBankAccount = async (req, res) => {
  try {
    const objectId = req.customer.customerId;
    const customer = await Customer.findById(objectId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
 
    const payload = {
      customerId: objectId,
      accountHolderName: req.body.accountHolderName || "DEFAULT_NAME",
      accountNumber: req.body.accountNumber || "DEFAULT_ACCOUNT",
      ifscCode: req.body.ifscCode || "DEFAULT_IFSC",
      initialBalance: req.body.balance ,
      lastUpdated: { type: Date, default: Date.now }
    };


    const response = await axios.post(`${process.env.ISSUER_SERVICE_URL}/bank/create`, payload, {
      headers: {
        "x-internal-secret": process.env.INTERNAL_SECRET_ISSUER 
      }
    });
   

    customer.bankAccount = {
      accountHolderName: payload.accountHolderName,
      accountNumber: payload.accountNumber,
      ifscCode: payload.ifscCode
    };
    await customer.save();

    res.status(201).json({
      message: "Bank account created successfully",
      accountDetails: response.data
    });

  } catch (err) {
    // console.error("Bank Account Init Error:", err.message , err?.response?.data);
    res.status(500).json({ message: "Failed to create bank account" });
  }
};




const updateBankAccount = async (req, res) => {
  try {

    const objectId = req.customer.customerId;
    const customer = await Customer.findById(objectId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Build the payload (only include fields that need updating)
    const payload = {
      customerId: objectId ,
      accountHolderName: req.body.accountHolderName,
      accountNumber: req.body.accountNumber,
      ifscCode: req.body.ifscCode,
      balance: req.body.balance,
      lastUpdated: new Date()
    };

    // Remove undefined fields 
    Object.keys(payload).forEach(
      key => payload[key] === undefined && delete payload[key]
    );

 
    const response = await axios.put(`${process.env.ISSUER_SERVICE_URL}/bank/update`, payload, {
      headers: {
        "x-internal-secret": process.env.INTERNAL_SECRET_ISSUER 
      }
    });

    customer.bankAccount = {
      accountHolderName: payload.accountHolderName ?? customer.bankAccount.accountHolderName,
      accountNumber: payload.accountNumber ?? customer.bankAccount.accountNumber,
      ifscCode: payload.ifscCode ?? customer.bankAccount.ifscCode
    };
    await customer.save();

    res.status(200).json({
      message: "Bank account updated successfully",
      updatedDetails: response.data
    });
  } catch (err) {
    // console.error("Bank Account Update Error:", err.message);
    res.status(500).json({ message: "Failed to update bank account" });
  }
};


const Refund = async (req, res) => {
  try {
    const objectId = req.customer.customerId;
    const customer = await Customer.findById(objectId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    
    const response = await axios.get(
      `${process.env.PAYMENT_GATEWAY_URL}/refunds/customer/${objectId}`
    );
    res.json(response.data);
  } catch (err) {
    // console.error(" Customer refund fetch error:", err.message);
    res.status(500).json({ message: "Failed to fetch refunds" });
  }
};

const transaction = async (req, res) => {
  try {
    const objectId = req.customer.customerId;
    const customer = await Customer.findById(objectId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const response = await axios.get(
      `${process.env.PAYMENT_GATEWAY_URL}/internal/transactions/by-customer/${objectId}`
    );
    res.json({ transactions: response.data.transactions });
  } catch (err) {
    // console.error("Error fetching transactions:", err?.response?.data || err.message);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
};



const bankInfo =async (req, res) => {
  try {
     const objectId = req.customer.customerId;

    const customer = await Customer.findById(objectId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const response = await axios.get(
      `${process.env.ISSUER_SERVICE_URL}/issuer/internal/${objectId}`
    );

    res.json({ bankAmount: response.data.bankAmount });
  } catch (err) {
    // console.error(" Bank Info Fetch Error:", err?.response?.data || err.message);
    res.status(500).json({ message: "Server error" });
  }
};


const requestRefund = async (req, res) => {


  try {
    const customerId = req.customer.customerId;
    const { transactionId, reason } = req.body;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const payload = {
      transactionId,
      reason,
      customerId
    };

    let response;
    try {
     response = await axios.post(
    `${process.env.PAYMENT_GATEWAY_URL}/refunds/${transactionId}/request`,
    payload,
    {
      headers: {
        'x-internal-token': process.env.INTERNAL_SECRET
      }
    }
  );
     
     res.status(200).json({ message: "Refund request sent", data: response.data });

    } catch (error) {
    //  console.error("Error sending refund request:", error.message);
}   
  } catch (error) {
    // console.error(" Error requesting refund:", error.message);
    res.status(500).json({ message: "Refund request failed" });
  }
};


module.exports = {
    createBankAccount,
    Refund,
    transaction,
    updateBankAccount,
    requestRefund,
    bankInfo
};