const CustomerBankAccount = require("../models/CustomerBankAccount");

const authorizePayment = async (req, res) => {
  const { cardLast4, amount, merchantId } = req.body;

  if (amount > 10000) {
    return res.status(200).json({
      status: "DECLINED",
      reason: "Insufficient funds or risk rejection"
    });
  }
  res.status(200).json({ status: "SUCCESS" });
};


const BankBalance = async (req, res) => {
  try {
    const { customerId } = req.params;

    let account = await CustomerBankAccount.findOne({ customerId });
    if (!account) return res.status(404).json({ message: "Customer bank account not found" });

    res.json({ bankAmount: account.balance });
  } catch(err) {
    // console.error(" Internal Fetch Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { authorizePayment, BankBalance};
