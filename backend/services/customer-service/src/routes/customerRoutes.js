const express = require("express");
const router = express.Router();
const Customer= require("../models/Customer");
const axios = require("axios");
const verifyToken = require("../middleware/verifyToken");
const { createBankAccount,Refund, transaction ,requestRefund ,updateBankAccount, bankInfo} = require("../controllers/customerController");    


router.post("/bank", verifyToken, createBankAccount);
router.put("/bank",verifyToken,updateBankAccount);

router.get("/refunds", verifyToken, Refund);
router.get("/transactions",verifyToken,transaction)

router.post("/refunds/request",verifyToken,requestRefund);
router.get("/bank-info", verifyToken, bankInfo);

module.exports = router;