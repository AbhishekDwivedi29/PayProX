const mongoose = require("mongoose");

const refundSchema = new mongoose.Schema({
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction",
    required: true
  },
  merchantId: {
    type: String,
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
   required: true },
  amount: {
    type: Number,
  },
  reason: {
    type: String
  },
  status: {
    type: String,
    enum: ["PENDING","APPROVED","REJECTED","COMPLETED","FAILED"],
    default: "PENDING"
  },
  failReason: {
    type: String 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Refund", refundSchema);


