const Transaction= require("../models/Transaction");

const merchantTransaction= async (req, res) => {
  try {
    const { merchantId } = req.params;

    const transactions = await Transaction.find({ merchantId }).sort({ createdAt: -1 });
   
    res.status(200).json({ transactions });
  } catch (err) {
    // console.error(" Internal Merchant Tx Fetch Error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


const customerTransaction= async (req, res) => {
  try {
    const { customerId } = req.params;
    const transactions = await Transaction.find({ customerId }).sort({ createdAt: -1 });

    if (!transactions.length) {
     return res.status(404).json({ message: "No transactions found" });
    }
    res.status(200).json({ transactions });
  } catch (err) {
    // console.error(" Internal Customer Tx Fetch Error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


const merchantTransactionForSettlement=async (req, res) => {
  try {
    const { status, beforeDate } = req.query;
    const { merchantId } = req.params;
    const filter = { merchantId };

    if (status) filter.status = status;

    if (beforeDate) {
      const parsedDate = new Date(beforeDate);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ message: "Invalid beforeDate format" });
      }
      filter.createdAt = { $lte: parsedDate };
    }

    const transactions = await Transaction.find(filter);

    res.status(200).json({ transactions });
  } catch (err) {
    // console.error("Internal Transaction Fetch Error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};



const markSettlement=async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    transaction.isSettled = true;
    await transaction.save();

    res.json({ message: "Transaction marked as settled " });
  } catch (err) {
    // console.error(" Mark as settled error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports={
    customerTransaction,
    merchantTransaction,
    merchantTransactionForSettlement,
    markSettlement
};






