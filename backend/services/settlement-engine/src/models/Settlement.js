const mongoose = require("mongoose");

const settlementSchema = new mongoose.Schema({
  merchantId: String,
  transactionIds: [String],
  totalAmount: Number,
  transactionCount: Number,
  settledAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Settlement", settlementSchema);


