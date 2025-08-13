
const express = require("express");
const router = express.Router();
const axios = require("axios");
const Merchant = require("../models/Merchant");
const verifyToken = require("../middleware/verifyToken");

const { createBankAccount, approveRefund , rejectRefund, refund, updateBankAccount, transaction ,Settlement} = require("../controllers/merchantController");

router.post("/bank", verifyToken, createBankAccount);
router.put("/bank", verifyToken, updateBankAccount);

router.put("/refunds/:refundId/approve", verifyToken, approveRefund);
router.put("/refunds/:refundId/reject", verifyToken, rejectRefund);

router.get("/transactions",  verifyToken, transaction);
router.get("/settlements", verifyToken, Settlement);
router.get("/refunds", verifyToken, refund);

module.exports = router;