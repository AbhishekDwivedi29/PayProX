const mongoose = require("mongoose");

const merchantBankSchema = new mongoose.Schema({
  merchantId: { type: String, required: true, unique: true },
  accountHolderName: { type: String, required: true },
  accountNumber: { type: String, required: true, unique: true },
  ifscCode: { type: String, required: true },
  balance: { type: Number, default: 100000 },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model("MerchantBankAccount", merchantBankSchema);
