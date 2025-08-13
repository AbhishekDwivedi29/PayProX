const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const verifyCustomerToken = require("../middleware/verifyCustomerToken");
const { initiatePayment, getCustomerTransactions,getSavedCards ,getCustomerRefundsAndChargebacks , tokenization} = require("../controllers/paymentController");





router.post("/initiate", verifyCustomerToken, initiatePayment);

router.get("/customer", verifyCustomerToken, getCustomerTransactions); 

router.get("/customer/saved-cards", verifyCustomerToken, getSavedCards);

router.post("/createtoken",verifyCustomerToken,tokenization);


module.exports = router;
  
