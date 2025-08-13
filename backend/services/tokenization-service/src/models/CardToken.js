const mongoose = require("mongoose");

const cardTokenSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true,
  },
  cardHolderName: String,
  cardLast4: String,
   expiryDate: String,

  cardNetwork: String,
  token: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("CardToken", cardTokenSchema);

