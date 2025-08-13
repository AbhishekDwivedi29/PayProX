// src/models/CustomerBankAccount.js
const mongoose = require("mongoose");

const bankAccountSchema = new mongoose.Schema({
  customerId: { type: String, required: true, unique: true },
  accountHolderName: { type: String, required: true },
  accountNumber: { type: String, required: true, unique: true },
  ifscCode: { type: String, required: true },
  balance: { type: Number, default: 1000000 }, 
  lastUpdated: { type: Date, default: Date.now },
  netbanking: {
    username: { type: String, unique: true, sparse: true },
    passwordHash: String 
  }
});

module.exports = mongoose.model("CustomerBankAccount", bankAccountSchema);

