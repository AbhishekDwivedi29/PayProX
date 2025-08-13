const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  merchantId: { type: String, required: true },
  token: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, default: "INR" },

  customerId: { type: String, required: false},

  cardLast4: String,
  cardNetwork: String,
  netbankingUsername: String,
  method: {
    type: String,
    enum: ["card", "netbanking"],
    required: true
  },
  status: {
    type: String,
    enum: ["SUCCESS", "DECLINED", "BLOCKED_BY_RISK", "REFUNDED","CHARGEBACK","REFUND INITIATED"],
    required: true
  },
    isSettled: {
    type: Boolean,
    default: false,
  },

  failureReason: String,
  responseCode: String,

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Transaction", transactionSchema);



