const MerchantBankAccount = require("../models/MerchantBankAccount");

// Credit merchant (for settlements)
exports.creditAccount = async (req, res) => {

  const { merchantId, amount, description } = req.body;
  if (!merchantId || !amount) return res.status(400).json({ message: "Missing fields" });

  try {

    let account = await MerchantBankAccount.findOne({ merchantId });
    if (!account) {
      return res.status(404).json({ message: "Merchant bank account not found" });
    }
    account.balance += amount;
    account.lastUpdated = Date.now();
    await account.save();

    // console.log(`Credited ₹${(amount/100).toFixed(2)} to merchant ${merchantId}. Reason: ${description || "N/A"}`);
    res.json({ message: "Account credited", account });

  } catch (err) {
    // console.error("Merchant account credit error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};


// Debit merchant (for refund)
exports.debitAccount = async (req, res) => {

  const { merchantId, amount, description } = req.body;
  if (!merchantId || !amount) return res.status(400).json({ message: "Missing fields" });

  try {

    let account = await MerchantBankAccount.findOne({ merchantId });
    if (!account) return res.status(404).json({ message: "Merchant bank account not found" });
    if (account.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }
    account.balance -= amount;
    account.lastUpdated = Date.now();
    await account.save();

    // console.log(`Debited ₹${(amount/100).toFixed(2)} from merchant ${merchantId}. Reason: ${description || "N/A"}`);
    res.json({ message: "Account debited", account });

  } catch (err) {
    // console.error("Merchant account debit error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};


exports.createBankAccount = async (req, res) => {
  try {
    const {
      merchantId,
      accountHolderName,
      accountNumber,
      ifscCode,
      initialBalance
    } = req.body;

  
  
    if (!merchantId || !accountHolderName || !accountNumber || !ifscCode ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await MerchantBankAccount.findOne({ merchantId });
    if (existing) {
      return res.status(409).json({ message: "Bank account already exists for this merchant" });
    }

    const newAccount = await MerchantBankAccount.create({
      merchantId,
      accountHolderName,
      accountNumber,
      ifscCode,
      balance: initialBalance,
      lastUpdated: new Date()
    });

    res.status(201).json({
      message: "Bank account created",
      account: newAccount
    });
  } catch (err) {
    // console.error("❌ Bank account creation failed:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.updateBankAccount = async (req, res) => {
  try {
    const {
      merchantId,
      accountHolderName,
      accountNumber,
      ifscCode,
      balance
    } = req.body;



    if (!merchantId || !accountHolderName || !accountNumber || !ifscCode ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Build dynamic update payload
    const updateFields = {};
    if (accountHolderName) updateFields.accountHolderName = accountHolderName;
    if (accountNumber) updateFields.accountNumber = accountNumber;
    if (ifscCode) updateFields.ifscCode = ifscCode;
    if (balance !== undefined) updateFields.balance = balance;
    

    updateFields.lastUpdated = new Date();

    const updatedAccount = await MerchantBankAccount.findOneAndUpdate(
      { merchantId },
      { $set: updateFields },
      { new: true }
    );


    if (!updatedAccount) {
      return res.status(404).json({ message: "Bank account not found for this merchant" });
    }

    res.status(200).json({
      message: "Bank account updated successfully",
      account: updatedAccount
    });
  } catch (err) {
    // console.error(" Failed to update bank account:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};