const mongoose = require("mongoose");

const merchantSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  kycStatus: {
    type: String,
    enum: ["PENDING", "VERIFIED", "REJECTED"],
    default: "PENDING",
  },
  websiteDeployed: {
    type: Boolean,
    default: false
  },
  secretKey: {
    type: String,
  },
  merchantId: {
    type: String,
    unique: true,
  },
  bankAccount: {
  accountHolderName: { type: String },
  accountNumber: { type: String },
  ifscCode: { type: String }
},
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Merchant", merchantSchema);
