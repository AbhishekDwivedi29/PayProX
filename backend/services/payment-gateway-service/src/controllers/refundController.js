const Refund = require("../models/Refund");
const Transaction = require("../models/Transaction");
const axios = require("axios");


const approveRefund = async (req, res) => {
  const { refundId } = req.params;
  const { merchantId } = req.body;
  
  try {
    const refund = await Refund.findById(refundId);
   
    if (!refund || refund.merchantId !== merchantId) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    if (refund.status !== "PENDING") {
      return res.status(400).json({ message: "Cannot approve in this state" });
    }

    refund.status = "APPROVED";
  
    await refund.save();

    
    res.json({ message: "Refund approved", refund });
  } catch (err) {
    console.error(" Refund approve failed:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};


const rejectRefund = async (req, res) => {
  const { refundId } = req.params;
  const { merchantId, failReason } = req.body;

  try {
    const refund = await Refund.findById(refundId);
     const transactionId =refund.transactionId
    if (!refund || refund.merchantId !== merchantId) {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (refund.status !== "PENDING") {
      return res.status(400).json({ message: "Cannot reject in this state" });
    }

    refund.status = "REJECTED";
    refund.failReason = failReason;
    const tx = await Transaction.findById(transactionId);
    tx.status ="SUCCESS";
    await refund.save();
    await tx.save();
    
    res.json({ message: "Refund rejected", refund });
  } catch (err) {
    console.error("Refund reject failed:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};




const requestRefund = async (req, res) => {
  const { transactionId, reason ,customerId} = req.body;


  try {
    const tx = await Transaction.findById(transactionId);
    if (!tx || tx.customerId !== customerId) {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (tx.status !== "SUCCESS") {
      return res.status(400).json({ message: "Only successful tx can be refunded" });
    }

    const refund = await Refund.create({
      transactionId, customerId, merchantId: tx.merchantId,
       reason, status: "PENDING", amount :tx.amount
    });

    tx.status = "REFUND INITIATED";
    await tx.save();


    res.status(201).json({ message: "Refund requested", refund });
  } catch (err) {
    console.error(" Refund request failed:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};



const executeRefund = async (req, res) => {

  const { refundId } = req.params;
  try {
    const refund = await Refund.findById(refundId);
    if (!refund || refund.status !== "APPROVED") {
      return res.status(400).json({ message: "Cannot execute refund unless approved" });
    }

    const tx = await Transaction.findById(refund.transactionId);
    if (!tx) return res.status(404).json({ message: "Transaction not found" });

    const wasSettled = !!tx.isSettled; 
    
    
    //step 1
    if (wasSettled) {
      await axios.post(
        `${process.env.ACQUIRER_SERVICE_URL}/api/bank/debit`,
        { merchantId: tx.merchantId, amount: tx.amount },
        { headers: { "x-internal-secret": process.env.INTERNAL_SECRET } }
      );
    }

    //step 2
    await axios.post(
      `${process.env.ISSUER_SERVICE_URL}/api/bank/credit`,
      { customer: tx.customerId, amount: tx.amount, description: `Refund for tx ${tx._id}` },
      { headers: { "x-internal-secret": process.env.ISSUER_INTERNAL_SECRET } }
    );

    // Step 3
    refund.status = "COMPLETED";
    refund.amount = tx.amount; 
    await refund.save();

    tx.status = "REFUNDED";
    await tx.save();

    res.json({ message: "Refund executed (bank transfer simulated)", refund });
  } catch (err) {
    console.error("Refund execution error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};




const customerRefund= async (req, res) => {
  try {
    const refunds = await Refund.find({ customerId: req.params.customerId }).sort({ createdAt: -1 });
    res.status(200).json({ refunds });
  } catch (err) {
    // console.error(" Refund Fetch Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const merchantRefund= async (req, res) => {
  try {
    const refunds = await Refund.find({ merchantId: req.params.merchantId }).sort({ createdAt: -1 });
    res.status(200).json({ refunds });
  } catch (err) {
    // console.error("Refund Fetch Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  approveRefund,
  rejectRefund,
  requestRefund,
  executeRefund,
  customerRefund,
  merchantRefund
};


